import os
import sys
import json
import subprocess
import numpy as np
import scipy.ndimage as ndi

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ASSETS_JSON_PATH = os.path.join(REPO_ROOT, 'public', 'assets', 'assets.json')
VIDEO_DIR = os.path.join(REPO_ROOT, 'public', 'assets', 'video')

def hair(a):  # a = RGBA uint8 array
    al = a[..., 3] > 200
    if not np.any(al):
        return None
    lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    ys, xs = np.where(al)
    top = ys.min()
    h = ys.max() - top
    if h < 20:
        return None
    
    m = (lum < 70) & al
    m[int(top + h * 0.35):] = False
    
    dilated = ndi.binary_dilation(m, iterations=4)
    lab, n = ndi.label(dilated)
    if n == 0:
        return None
    
    sums = ndi.sum(m, lab, range(1, n + 1))
    if len(sums) == 0:
        return None
    
    k = 1 + int(np.argmax(sums))
    c = (lab == k) & m
    yy, xx = np.where(c)
    if len(xx) < 15 or len(yy) < 5:
        return None
        
    H, W = al.shape[:2]
    return float(xx.mean() / W), float(yy.min() / H), float((xx.max() - xx.min()) / W)

def track_video(video_filename, width, height, fps=4):
    video_path = os.path.join(VIDEO_DIR, video_filename)
    if not os.path.exists(video_path):
        print(f"Warning: {video_path} not found.")
        return []

    print(f"Tracking {video_filename} ({width}x{height} at {fps} fps)...")
    cmd = [
        'ffmpeg',
        '-y',
        '-v', 'error',
        '-i', video_path,
        '-vf', f'fps={fps}',
        '-f', 'rawvideo',
        '-pix_fmt', 'rgba',
        'pipe:1'
    ]

    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    frame_size = width * height * 4
    tracks = []
    frame_idx = 0
    dt = 1.0 / fps

    while True:
        raw_bytes = proc.stdout.read(frame_size)
        if len(raw_bytes) < frame_size:
            break
        
        frame = np.frombuffer(raw_bytes, dtype=np.uint8).reshape((height, width, 4))
        res = hair(frame)
        t = round(frame_idx * dt, 3)
        if res is not None:
            cx, top, w = res
            tracks.append({
                't': t,
                'cx': round(cx, 4),
                'top': round(top, 4),
                'w': round(w, 4)
            })
        frame_idx += 1

    proc.stdout.close()
    proc.stderr.close()
    proc.wait()
    print(f"  Done {video_filename}: found {len(tracks)} tracked frames out of {frame_idx} total.")
    return tracks

def main():
    with open(ASSETS_JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    videos = data.get('videos', {})
    for vname, vmeta in videos.items():
        src = vmeta.get('src')
        w = vmeta.get('w', 1280)
        h = vmeta.get('h', 720)
        track = track_video(src, w, h, fps=4)
        vmeta['headTrack'] = track

    with open(ASSETS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=1)

    print("Updated public/assets/assets.json with videoHeadTracks successfully.")

if __name__ == '__main__':
    main()
