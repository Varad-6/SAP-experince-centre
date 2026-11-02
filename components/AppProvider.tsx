'use client';

import React, { useEffect, useState } from 'react';
import { QualityProvider } from './three/QualityProvider';
import { CanvasRoot } from './three/CanvasRoot';
import { TopBar } from './hud/TopBar';
import { PillarRail } from './hud/PillarRail';
import { useGlobalInput } from '@/lib/input';
import { detectDevice } from '@/lib/device';
import { useStore } from '@/lib/store';

function InputManager() {
  useGlobalInput();
  return null;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAutoplay } = useStore();
  const [cursorHidden, setCursorHidden] = useState(false);

  useEffect(() => {
    const dev = detectDevice();
    if (dev.isKiosk || dev.isBigScreen) {
      setAutoplay(true);

      let idleTimer: NodeJS.Timeout;
      const onMouseMove = () => {
        setCursorHidden(false);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          setCursorHidden(true);
        }, 3000);
      };

      window.addEventListener('mousemove', onMouseMove);
      return () => {
        clearTimeout(idleTimer);
        window.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [setAutoplay]);

  return (
    <QualityProvider>
      <InputManager />
      <div className={cursorHidden ? 'cursor-none select-none' : ''}>
        {/* 3D WebGL Canvas Layer */}
        <CanvasRoot />
        {/* HUD Layer */}
        <TopBar />
        <PillarRail />
        {/* Content Stage Layer */}
        <div className="relative z-10 pt-20 pb-16 min-h-screen">
          {children}
        </div>
      </div>
    </QualityProvider>
  );
};
