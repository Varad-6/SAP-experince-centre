'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChromaKeyCanvas } from './ChromaKeyCanvas';
import { BotBubble } from './BotBubble';
import assetsData from '@/public/assets/assets.json';

export type ActorVideoName = 'intro_drop' | 'analytics_laptop' | 'explain_close';

export interface HeadTrackKeyframe {
  t: number;
  cx: number;
  top: number;
  w: number;
}

export interface ActorVideoMeta {
  src: string;
  fallbackMp4: string;
  poster: string;
  w: number;
  h: number;
  durationSec: number;
  keyColor: string;
  similarity: number;
  smoothness: number;
  defaultBubbleStartSec: number;
  headAtEnd: {
    cx: number;
    top: number;
    w?: number;
  };
  headTrack?: HeadTrackKeyframe[];
}

export const ACTOR_VIDEOS: Record<ActorVideoName, ActorVideoMeta> = {
  intro_drop: {
    src: '/assets/video/intro_drop.webm',
    fallbackMp4: '/assets/video/intro_drop_nokey.mp4',
    poster: '/assets/video/intro_drop_last.png',
    w: 1280,
    h: 720,
    durationSec: 10,
    keyColor: '#E95DCF',
    similarity: 0.38,
    smoothness: 0.10,
    defaultBubbleStartSec: 1.8,
    headAtEnd: { cx: 0.495, top: 0.04, w: 0.35 },
    headTrack: (assetsData.videos as any)?.intro_drop?.headTrack,
  },
  analytics_laptop: {
    src: '/assets/video/analytics_laptop.webm',
    fallbackMp4: '/assets/video/analytics_laptop_nokey.mp4',
    poster: '/assets/video/analytics_laptop_last.png',
    w: 1920,
    h: 1080,
    durationSec: 10,
    keyColor: '#F445AE',
    similarity: 0.36,
    smoothness: 0.10,
    defaultBubbleStartSec: 1.2,
    headAtEnd: { cx: 0.543, top: 0.06, w: 0.30 },
    headTrack: (assetsData.videos as any)?.analytics_laptop?.headTrack,
  },
  explain_close: {
    src: '/assets/video/explain_close.webm',
    fallbackMp4: '/assets/video/explain_close_nokey.mp4',
    poster: '/assets/video/explain_close_last.png',
    w: 1920,
    h: 1080,
    durationSec: 10,
    keyColor: '#F647BC',
    similarity: 0.36,
    smoothness: 0.10,
    defaultBubbleStartSec: 0.8,
    headAtEnd: { cx: 0.495, top: 0.04, w: 0.35 },
    headTrack: (assetsData.videos as any)?.explain_close?.headTrack,
  },
};

export interface ActorVideoProps {
  name: ActorVideoName;
  bubbleText?: string;
  bubbleStartSec?: number;
  onEnded?: () => void;
  holdLastFrame?: boolean;
  className?: string;
  active?: boolean;
  autoPlay?: boolean;
}

export const ActorVideo: React.FC<ActorVideoProps> = ({
  name,
  bubbleText,
  bubbleStartSec,
  onEnded,
  holdLastFrame = true,
  className = '',
  active = true,
  autoPlay = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [useWebM, setUseWebM] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(false);
  const [headScreen, setHeadScreen] = useState<{ headX: number; hairTopY: number; headW: number } | undefined>(undefined);

  const smoothedRef = useRef<{ cx: number; top: number; w: number } | null>(null);
  const bubbleTriggeredRef = useRef<boolean>(false);
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const meta = ACTOR_VIDEOS[name];
  const triggerSec = bubbleStartSec ?? meta.defaultBubbleStartSec;

  // 1. Detect platform & WebM alpha support + reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setUseWebM(!isSafari && !isIOS);

      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
    }
  }, []);

  // Compute interpolated head coordinate at time t
  const getInterpolatedTrack = useCallback(
    (currentTime: number): { cx: number; top: number; w: number } => {
      const track = meta.headTrack;
      if (!track || track.length === 0) {
        return {
          cx: meta.headAtEnd.cx,
          top: meta.headAtEnd.top,
          w: meta.headAtEnd.w ?? 0.25,
        };
      }

      if (currentTime <= track[0].t) {
        return { cx: track[0].cx, top: track[0].top, w: track[0].w };
      }
      if (currentTime >= track[track.length - 1].t) {
        const last = track[track.length - 1];
        return { cx: last.cx, top: last.top, w: last.w };
      }

      // Linear search or binary search
      let i = 0;
      while (i < track.length - 1 && track[i + 1].t < currentTime) {
        i++;
      }
      const k0 = track[i];
      const k1 = track[i + 1];
      const span = k1.t - k0.t;
      const ratio = span > 0 ? (currentTime - k0.t) / span : 0;

      return {
        cx: k0.cx + ratio * (k1.cx - k0.cx),
        top: k0.top + ratio * (k1.top - k0.top),
        w: k0.w + ratio * (k1.w - k0.w),
      };
    },
    [meta.headTrack, meta.headAtEnd]
  );

  // Update screen coordinates using smoothed keyframes
  const updateScreenPosition = useCallback(
    (currentTime: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const raw = getInterpolatedTrack(currentTime);

      let target = raw;
      if (smoothedRef.current === null) {
        smoothedRef.current = { ...raw };
      } else {
        const alpha = 0.25;
        smoothedRef.current = {
          cx: smoothedRef.current.cx + alpha * (raw.cx - smoothedRef.current.cx),
          top: smoothedRef.current.top + alpha * (raw.top - smoothedRef.current.top),
          w: smoothedRef.current.w + alpha * (raw.w - smoothedRef.current.w),
        };
        target = smoothedRef.current;
      }

      setHeadScreen({
        headX: rect.left + target.cx * rect.width,
        hairTopY: rect.top + target.top * rect.height,
        headW: target.w * rect.width,
      });
    },
    [getInterpolatedTrack]
  );

  useEffect(() => {
    const handleResize = () => {
      const curTime = videoRef.current?.currentTime ?? meta.durationSec;
      updateScreenPosition(curTime);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [updateScreenPosition, meta.durationSec]);

  // If reduced motion is requested, show poster & bubble immediately
  useEffect(() => {
    if (reducedMotion && active) {
      setShowBubble(true);
      updateScreenPosition(meta.durationSec);
      onEnded?.();
    }
  }, [reducedMotion, active, onEnded, updateScreenPosition, meta.durationSec]);

  // Video playback & time tracking loop
  useEffect(() => {
    if (reducedMotion || !active) return;

    const video = videoRef.current;
    if (!video) return;

    let frameCallbackId: number | null = null;
    let endedFired = false;

    bubbleTriggeredRef.current = false;
    setShowBubble(false);
    smoothedRef.current = null;
    video.currentTime = 0;

    if (autoPlay) {
      video.play().catch(() => {});
    }

    const checkTime = (currentTime: number) => {
      updateScreenPosition(currentTime);

      if (currentTime >= triggerSec && !bubbleTriggeredRef.current) {
        bubbleTriggeredRef.current = true;
        setShowBubble(true);
      }

      const endThreshold = meta.durationSec - 0.08;
      if (currentTime >= endThreshold && !endedFired) {
        endedFired = true;
        if (holdLastFrame) {
          video.pause();
        }
        onEndedRef.current?.();
      }
    };

    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      const onFrame: VideoFrameRequestCallback = (_now, metadata) => {
        checkTime(metadata.mediaTime);
        if (!endedFired || video.currentTime < meta.durationSec - 0.08) {
          frameCallbackId = (video as any).requestVideoFrameCallback(onFrame);
        }
      };
      frameCallbackId = (video as any).requestVideoFrameCallback(onFrame);
    } else {
      const handleTimeUpdate = () => checkTime(video.currentTime);
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }

    return () => {
      if (frameCallbackId !== null && 'cancelVideoFrameCallback' in HTMLVideoElement.prototype) {
        (video as any).cancelVideoFrameCallback(frameCallbackId);
      }
    };
  }, [
    name,
    active,
    autoPlay,
    reducedMotion,
    triggerSec,
    meta.durationSec,
    holdLastFrame,
    updateScreenPosition,
  ]);

  return (
    <div
      ref={containerRef}
      className={`actor relative aspect-video select-none ${className}`}
      style={{ overflow: 'visible' }}
    >
      {reducedMotion ? (
        <img
          src={meta.poster}
          alt={`Lead Architect Bot - ${name}`}
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : useWebM ? (
        <video
          ref={videoRef}
          src={meta.src}
          poster={meta.poster}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={meta.fallbackMp4}
            poster={meta.poster}
            muted
            playsInline
            preload="auto"
            className="hidden"
          />
          <ChromaKeyCanvas
            videoElement={videoRef.current}
            keyColorHex={meta.keyColor}
            similarity={meta.similarity}
            smoothness={meta.smoothness}
            width={meta.w}
            height={meta.h}
          />
        </>
      )}

      {/* Floating Thinking Bubble anchored dynamically to moving head */}
      {showBubble && bubbleText && headScreen && (
        <BotBubble
          text={bubbleText}
          head={headScreen}
          topSafe={76}
          placement="top"
          onDismiss={() => setShowBubble(false)}
        />
      )}
    </div>
  );
};
