'use client';

import React from 'react';
import { Backdrop } from './Backdrop';
import { CameraRig } from './CameraRig';

export const SceneManager: React.FC = () => {
  // Ultra-clean 3D scene: No dark cylinders, no noisy rotating stages, no dirty particle storms
  return (
    <>
      <CameraRig />
      <Backdrop />
    </>
  );
};
