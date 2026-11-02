'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { Backdrop } from './Backdrop';
import { Particles } from './Particles';

export const SceneManager: React.FC = () => {
  const { scene } = useStore();
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Smooth camera positioning based on current scene state
    const cam = state.camera;

    let targetPos = [0, 2, 9];
    let targetLook = [0, 0, 0];

    switch (scene) {
      case 'LANDING':
        targetPos = [0, 2, 9];
        targetLook = [0, 0, 0];
        break;
      case 'PILLARS':
        targetPos = [0, 4, 12];
        targetLook = [0, 0, 0];
        break;
      case 'PILLAR':
        targetPos = [0, 2.5, 8];
        targetLook = [0, 0, 0];
        break;
      case 'PROJECT':
      case 'DEMO_INTRO':
      case 'DEMO':
      case 'DEMO_END':
        targetPos = [0, 1.8, 6.5];
        targetLook = [0, 0.5, 0];
        break;
    }

    cam.position.lerp(new THREE.Vector3(...targetPos), delta * 2.5);
    cameraTarget.current.lerp(new THREE.Vector3(...targetLook), delta * 2.5);
    cam.lookAt(cameraTarget.current);
  });

  return (
    <>
      <Backdrop />
      <Particles />

      {/* Decorative center stage disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <cylinderGeometry args={[5, 5.2, 0.2, 64]} />
        <meshStandardMaterial
          color="#0A1F44"
          metalness={0.8}
          roughness={0.2}
          emissive="#0070F2"
          emissiveIntensity={0.15}
        />
      </mesh>
    </>
  );
};
