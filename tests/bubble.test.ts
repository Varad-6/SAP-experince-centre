import { describe, it, expect } from 'vitest';
import { placeBubble } from '@/lib/placeBubble';
import botMeta from '@/public/assets/bot/_meta.json';
import assetsData from '@/public/assets/assets.json';

describe('placeBubble Unit Tests & Mathematical Invariants', () => {
  const VIEWPORTS = [
    { name: '390x844', w: 390, h: 844, topSafe: 64 },
    { name: '820x1180', w: 820, h: 1180, topSafe: 64 },
    { name: '1440x900', w: 1440, h: 900, topSafe: 64 },
    { name: '1920x1080', w: 1920, h: 1080, topSafe: 64 },
    { name: '3840x2160', w: 3840, h: 2160, topSafe: 64 },
  ];

  it('guarantees bubble.bottom <= hairTopY - 52 (or -40 on small screens) for every sprite pose when above', () => {
    const poses = Object.keys(botMeta) as (keyof typeof botMeta)[];
    expect(poses.length).toBeGreaterThan(0);

    for (const poseName of poses) {
      const meta = (botMeta as any)[poseName];
      const H = 280;
      const W = Math.round(meta.w * (H / 640));
      const T = 500;
      const L = 600;
      const hairTopY = T + meta.head.hairTop * H;
      const headX = L + meta.head.headCx * W;
      const headW = 0.8 * W;

      for (const vp of VIEWPORTS) {
        const bw = 320;
        const bh = 100;
        const placement = placeBubble({
          headX,
          hairTopY,
          headW,
          bw,
          bh,
          vw: vp.w,
          vh: vp.h,
          topSafe: vp.topSafe,
        });

        if (placement.mode === 'above') {
          const bubbleBottom = placement.top + (placement.maxH ?? bh);
          const minClearance = vp.w < 640 ? 40 : 52;
          expect(bubbleBottom).toBeLessThanOrEqual(hairTopY - minClearance + 0.1);
        } else {
          // In side modes (right/left), bubble does not intersect the head rectangle
          const half = headW / 2;
          const headLeft = headX - half;
          const headRight = headX + half;
          const bubbleLeft = placement.left;
          const bubbleRight = placement.left + bw;

          const overlapsX = bubbleLeft < headRight && bubbleRight > headLeft;
          expect(overlapsX).toBe(false);
        }

        // Must always remain within horizontal bounds [16, vw - 16]
        expect(placement.left).toBeGreaterThanOrEqual(16);
        expect(placement.left + bw).toBeLessThanOrEqual(vp.w - 16 + 0.1);
      }
    }
  });

  it('verifies videos headTrack data exists and contains keyframes for all 3 landing videos', () => {
    const videos = (assetsData as any).videos;
    expect(videos.intro_drop.headTrack).toBeDefined();
    expect(videos.intro_drop.headTrack.length).toBeGreaterThanOrEqual(30);

    expect(videos.analytics_laptop.headTrack).toBeDefined();
    expect(videos.analytics_laptop.headTrack.length).toBeGreaterThanOrEqual(30);

    expect(videos.explain_close.headTrack).toBeDefined();
    expect(videos.explain_close.headTrack.length).toBeGreaterThanOrEqual(30);
  });
});
