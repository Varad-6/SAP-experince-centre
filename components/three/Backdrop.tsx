'use client';

import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const Backdrop: React.FC = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color('#050E22');
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#EAF2FF" />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color="#0070F2" />
      <pointLight position={[0, 8, 5]} intensity={0.8} color="#00B8F5" />
    </>
  );
};
