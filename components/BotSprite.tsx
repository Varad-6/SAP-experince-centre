'use client';

import React, { useState, useEffect } from 'react';
import { PoseName, BOT_POSES, POSE_FIT } from '@/lib/poses';

export interface BotSpriteProps {
  pose?: PoseName;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  alt?: string;
}

const PLACEHOLDER = '/assets/bot/_placeholder.svg';

export const BotSprite: React.FC<BotSpriteProps> = ({
  pose = 'idle',
  width = 120,
  height = 120,
  className = '',
  onClick,
  alt = 'Lead Architect Bot',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(BOT_POSES[pose] || PLACEHOLDER);
  const fit = POSE_FIT[pose] || { scale: 1, offsetY: 0 };

  useEffect(() => {
    setImgSrc(BOT_POSES[pose] || PLACEHOLDER);
  }, [pose]);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-contain pointer-events-none transition-transform duration-200"
        style={{
          transform: `scale(${fit.scale}) translateY(${fit.offsetY}px)`,
        }}
        onError={() => {
          if (imgSrc !== PLACEHOLDER) {
            setImgSrc(PLACEHOLDER);
          }
        }}
      />
    </div>
  );
};
