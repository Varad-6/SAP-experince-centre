'use client';

import React, { useState, useEffect } from 'react';
import { Glasses } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { xrStore } from '@/lib/xr';

export const VRButton: React.FC = () => {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      const navXr = (navigator as unknown as { xr: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr;
      if (navXr && typeof navXr.isSessionSupported === 'function') {
        navXr.isSessionSupported('immersive-vr')
          .then((isSupported) => setSupported(isSupported))
          .catch(() => setSupported(false));
      }
    }
  }, []);

  if (!supported) return null;

  return (
    <IconButton
      icon={<Glasses className="w-4 h-4" />}
      label="Enter WebXR VR"
      onClick={() => {
        xrStore.enterVR().catch(() => {});
      }}
    />
  );
};
