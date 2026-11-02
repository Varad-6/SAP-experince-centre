'use client';

import React from 'react';
import { Backdrop } from './Backdrop';
import { Particles } from './Particles';
import { Stage } from './Stage';
import { PillarsRing } from './PillarsRing';
import { CameraRig } from './CameraRig';
import { Bot } from './Bot';
import { Drone } from './Drone';

export const SceneManager: React.FC = () => {
  return (
    <>
      <CameraRig />
      <Backdrop />
      <Particles />
      <Stage />
      <PillarsRing />
      <Bot />
      <Drone />
    </>
  );
};
