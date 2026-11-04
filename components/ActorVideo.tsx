'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChromaKeyCanvas } from './ChromaKeyCanvas';
import { BotBubble } from './BotBubble';

export type ActorVideoName = 'intro_drop' | 'analytics_laptop' | 'explain_close';

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
  };
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
    defaultBubbleStartSec: 8.6,
    headAtEnd: { cx: 0.447, top: 0.262 },
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
    defaultBubbleStartSec: 4.5,
    headAtEnd: { cx: 0.557, top: 0.053 },
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
    defaultBubbleStartSec: 1.0,
    headAtEnd: { cx: 0.497, top: 0.043 },
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
  const [headPos, setHeadPos] = useState<{ x: number; y: number } | undefined>(undefined);
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  const meta = ACTOR_VIDEOS[name];
  const triggerSec = bubbleStartSec ?? meta.defaultBubbleStartSec;

  // 1. Detect platform & WebM alpha support + reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setUseWebM(!isSafari && !isIOS);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  // Compute head screen coordinates from container bounding box
  const updateHeadPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = rect.left + rect.width * meta.headAtEnd.cx;
    const y = rect.top + rect.height * meta.headAtEnd.top;
    setHeadPos({ x, y });
  }, [meta.headAtEnd]);

  useEffect(() => {
    updateHeadPosition();
    window.addEventListener('resize', updateHeadPosition);
    return () => window.removeEventListener('resize', updateHeadPosition);
  }, [updateHeadPosition]);

  // If reduced motion is requested, show poster & bubble immediately
  useEffect(() => {
    if (reducedMotion && active) {
      setShowBubble(true);
      updateHeadPosition();
      onEnded?.();
    }
  }, [reducedMotion, active, onEnded, updateHeadPosition]);

  // Video playback & time tracking loop
  useEffect(() => {
    if (reducedMotion || !active) return;

    const video = videoRef.current;
    if (!video) return;

    let frameCallbackId: number | null = null;
    let endedFired = false;

    setShowBubble(false);
    setHasEnded(false);
    video.currentTime = 0;

    if (autoPlay) {
      video.play().catch(() => {
        // Autoplay may be deferred by browser policy; muted helps avoid it
      });
    }

    const checkTime = (currentTime: number) => {
      if (currentTime >= triggerSec && !showBubble) {
        setShowBubble(true);
        updateHeadPosition();
      }

      const endThreshold = meta.durationSec - 0.08;
      if (currentTime >= endThreshold && !endedFired) {
        endedFired = true;
        setHasEnded(true);
        if (holdLastFrame) {
          video.pause();
        }
        onEnded?.();
      }
    };

    // Use requestVideoFrameCallback if available, fallback to timeupdate
    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      const onFrame: VideoFrameRequestCallback = (now, metadata) => {
        checkTime(metadata.mediaTime);
        if (!endedFired) {
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
  }, [name, active, autoPlay, reducedMotion, triggerSec, meta.durationSec, holdLastFrame, onEnded, updateHeadPosition]);

  return (
    <div
      ref={containerRef}
      className={`actor relative aspect-video select-none ${className}`}
      style={{ overflow: 'visible' }}
    >
      {reducedMotion ? (
        /* Reduced motion: poster still */
        <img
          src={meta.poster}
          alt={`Lead Architect Bot - ${name}`}
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : useWebM ? (
        /* Native transparent WebM VP9 */
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
        /* Safari / iOS WebGL chroma-key shader fallback */
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

      {/* Floating Thinking Bubble anchored to headAtEnd */}
      {showBubble && bubbleText && (
        <BotBubble
          text={bubbleText}
          headPos={headPos}
          placement="top"
          onDismiss={() => setShowBubble(false)}
        />
      )}
    </div>
  );
};
