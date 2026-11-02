'use client';

import React from 'react';
import { QualityProvider } from './three/QualityProvider';
import { CanvasRoot } from './three/CanvasRoot';
import { TopBar } from './hud/TopBar';
import { PillarRail } from './hud/PillarRail';
import { useGlobalInput } from '@/lib/input';

function InputManager() {
  useGlobalInput();
  return null;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QualityProvider>
      <InputManager />
      {/* 3D WebGL Canvas Layer */}
      <CanvasRoot />
      {/* HUD Layer */}
      <TopBar />
      <PillarRail />
      {/* Content Stage Layer */}
      <div className="relative z-10 pt-20 pb-16 min-h-screen">
        {children}
      </div>
    </QualityProvider>
  );
};
