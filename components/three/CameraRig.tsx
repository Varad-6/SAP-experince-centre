'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import pillarsData from '@/content/pillars.json';

export const CameraRig: React.FC = () => {
  const { scene, pillarId } = useStore();
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetPos = useRef(new THREE.Vector3(0, 2, 9));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      // Normalize mouse -1 to +1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((_, delta) => {
    // Determine target based on scene state
    switch (scene) {
      case 'LANDING':
        targetPos.current.set(0, 1.8, 8.8);
        targetLook.current.set(0, 0, 0);
        break;

      case 'PILLARS':
        targetPos.current.set(0, 4.2, 11.5);
        targetLook.current.set(0, -0.4, 0);
        break;

      case 'PILLAR':
        if (pillarId) {
          const idx = pillarsData.findIndex((p) => p.id === pillarId);
          if (idx !== -1) {
            const angle = (idx * (2 * Math.PI)) / pillarsData.length - Math.PI / 2;
            const px = Math.cos(angle) * 3.6;
            const pz = Math.sin(angle) * 3.6;
            // Position camera slightly back and elevated from that pillar
            targetPos.current.set(px * 1.6, 2.0, pz * 1.6 + 3.2);
            targetLook.current.set(px, -0.6, pz);
          }
        }
        break;

      case 'PROJECT':
      case 'DEMO_INTRO':
      case 'DEMO':
      case 'DEMO_END':
        targetPos.current.set(0, 1.4, 6.2);
        targetLook.current.set(0, 0.3, 0);
        break;

      default:
        targetPos.current.set(0, 2, 9);
        targetLook.current.set(0, 0, 0);
        break;
    }

    // Apply subtle mouse parallax (+/- 0.6 deg max)
    const parallaxX = mouse.current.x * 0.25;
    const parallaxY = mouse.current.y * 0.15;

    const currentTargetX = targetPos.current.x + parallaxX;
    const currentTargetY = targetPos.current.y + parallaxY;

    // Smooth lerp
    camera.position.x = THREE.MathUtils.damp(camera.position.x, currentTargetX, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, currentTargetY, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, 4, delta);

    // LookAt smoothing
    camera.lookAt(targetLook.current);
  });

  return null;
};
