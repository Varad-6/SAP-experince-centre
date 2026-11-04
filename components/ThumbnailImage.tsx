'use client';

import React, { useState } from 'react';

export interface ThumbnailImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ThumbnailImage: React.FC<ThumbnailImageProps> = ({
  src,
  alt,
  className = '',
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== '/assets/bot/_placeholder.svg') {
          setImgSrc('/assets/bot/_placeholder.svg');
        }
      }}
    />
  );
};
