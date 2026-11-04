'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PoseName,
  resolvePose,
  getPoseMeta,
  BOT_POSES,
  BOT_POSES_PNG,
  STANDING_HEIGHT_PX,
  PoseMeta,
} from '@/lib/poses';

export interface HeadPosition {
  headX: number;
  headY: number;
  k: number;
  anchorX: number;
  anchorY: number;
}

export interface BotSpriteProps {
  pose?: PoseName | string;
  heightPx?: number;
  width?: number; // legacy backwards compatibility
  height?: number; // legacy backwards compatibility
  dockX?: number; // if specified, positions feet anchor at dockX
  dockY?: number; // if specified, positions feet anchor at dockY
  className?: string;
  onClick?: () => void;
  title?: string;
  alt?: string;
  priority?: boolean;
  onHeadPosition?: (pos: HeadPosition) => void;
}

const PLACEHOLDER = '/assets/bot/_placeholder.svg';

export const BotSprite: React.FC<BotSpriteProps> = ({
  pose = 'idle',
  heightPx,
  width,
  height,
  dockX,
  dockY,
  className = '',
  onClick,
  title = 'Abhiyanta Guide',
  alt = 'Lead Architect Bot',
  priority = false,
  onHeadPosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolved = resolvePose(pose);
  const meta: PoseMeta = getPoseMeta(resolved);

  // Compute target display height:
  // If heightPx or height is passed, use it.
  // Otherwise, default to responsive baseline ~220px on desktop, ~160px on mobile.
  const targetH = heightPx ?? height ?? (width ? Math.round(width * (meta.h / meta.w)) : 220);
  const k = targetH / STANDING_HEIGHT_PX;

  const spriteW = Math.round(meta.w * k);
  const spriteH = Math.round(meta.h * k);

  const [hasError, setHasError] = useState(false);

  // Reset error when pose changes
  useEffect(() => {
    setHasError(false);
  }, [resolved]);

  // Report head position whenever pose, scale or positioning updates
  useEffect(() => {
    if (!onHeadPosition) return;

    if (dockX !== undefined && dockY !== undefined) {
      const left = dockX - meta.anchorX * k;
      const top = dockY - meta.anchorY * k;
      const headX = left + (meta.w * meta.head.headCx) * k;
      const headY = top + (meta.h * meta.head.hairTop) * k;
      onHeadPosition({ headX, headY, k, anchorX: meta.anchorX, anchorY: meta.anchorY });
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const headX = rect.left + (meta.w * meta.head.headCx) * k;
      const headY = rect.top + (meta.h * meta.head.hairTop) * k;
      onHeadPosition({ headX, headY, k, anchorX: meta.anchorX, anchorY: meta.anchorY });
    }
  }, [resolved, k, dockX, dockY, onHeadPosition, meta]);

  const webpSrc = BOT_POSES[resolved] || `/assets/bot/${resolved}.webp`;
  const pngSrc = BOT_POSES_PNG[resolved] || `/assets/bot/${resolved}.png`;

  // Absolute positioning when dockX / dockY are provided
  const isDocked = dockX !== undefined && dockY !== undefined;
  const style: React.CSSProperties = isDocked
    ? {
        position: 'absolute',
        left: `${dockX - meta.anchorX * k}px`,
        top: `${dockY - meta.anchorY * k}px`,
        width: `${spriteW}px`,
        height: `${spriteH}px`,
        willChange: 'transform',
      }
    : {
        width: `${spriteW}px`,
        height: `${spriteH}px`,
        willChange: 'transform',
      };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      title={title}
      className={`inline-block select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={style}
    >
      {hasError ? (
        <img
          src={PLACEHOLDER}
          alt={alt}
          width={spriteW}
          height={spriteH}
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <picture>
          <source type="image/webp" srcSet={webpSrc} />
          <img
            src={pngSrc}
            alt={alt}
            width={spriteW}
            height={spriteH}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-contain pointer-events-none"
            onError={() => setHasError(true)}
          />
        </picture>
      )}
    </div>
  );
};
