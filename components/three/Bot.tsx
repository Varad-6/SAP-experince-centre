'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useStore } from '@/lib/store';

function BotSprite() {
  const { botState, scene } = useStore();
  const meshRef = useRef<THREE.Mesh>(null!);

  // Load transparent PNG textures for the chibi avatar
  const textures = useTexture({
    standing: '/mascot/mascot_standing.png',
    pointing: '/mascot/mascot_pointing.png',
    explaining: '/mascot/mascot_explaining.png',
  });

  const activeTexture =
    botState === 'point'
      ? textures.pointing
      : botState === 'explain' || botState === 'celebrate'
      ? textures.explaining
      : textures.standing;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Breathing animation
    const breath = 1 + Math.sin(time * 2.5) * 0.02;
    meshRef.current.scale.y = 1.8 * breath;

    // Celebration jump in DEMO_END
    if (botState === 'celebrate') {
      meshRef.current.position.y = -0.5 + Math.abs(Math.sin(time * 6)) * 0.35;
      meshRef.current.rotation.y = Math.sin(time * 4) * 0.2;
    } else {
      meshRef.current.position.y = -0.5;
      meshRef.current.rotation.y = 0;
    }
  });

  return (
    <group position={[1.1, 0, 1.3]}>
      {/* Bot Shadow Decal */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* Billboard Chibi Mascot Mesh */}
      <mesh ref={meshRef} position={[0, -0.5, 0]}>
        <planeGeometry args={[1.35, 1.8]} />
        <meshBasicMaterial
          map={activeTexture}
          transparent
          alphaTest={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export const Bot: React.FC = () => {
  return (
    <React.Suspense fallback={null}>
      <BotSprite />
    </React.Suspense>
  );
};
