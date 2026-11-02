'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { xrStore } from '@/lib/xr';
import { useQuality } from './QualityProvider';
import { SceneManager } from './SceneManager';

export const CanvasRoot: React.FC = () => {
  const quality = useQuality();

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 2, 9], fov: 45 }}
        dpr={quality.dpr}
        gl={{
          antialias: quality.tier !== 'LOW',
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <XR store={xrStore}>
          <SceneManager />
        </XR>
      </Canvas>
    </div>
  );
};
