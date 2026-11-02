'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { TOKENS } from '@/lib/tokens';

export const Stage: React.FC = () => {
  const { scene, pillarId } = useStore();
  const groupRef = useRef<THREE.Group>(null!);
  const outerRingRef = useRef<THREE.Mesh>(null!);
  const innerRingRef = useRef<THREE.Mesh>(null!);

  const activeColor =
    pillarId && pillarId in TOKENS.pillars
      ? TOKENS.pillars[pillarId as keyof typeof TOKENS.pillars]
      : TOKENS.colors.sapBlue;

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle idle rotation in landing/pillars
      if (scene === 'LANDING' || scene === 'PILLARS') {
        groupRef.current.rotation.y += delta * 0.08;
      }
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.15;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.8, 0]}>
      {/* Primary Stage Disc */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[5.2, 5.5, 0.25, 64]} />
        <meshStandardMaterial
          color="#0A1F44"
          metalness={0.85}
          roughness={0.25}
          emissive={activeColor}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Floating Glass Floor Plate */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.8, 64]} />
        <meshPhysicalMaterial
          color="#102A5C"
          metalness={0.2}
          roughness={0.1}
          transmission={0.6}
          thickness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Concentric Neon Energy Rings */}
      <mesh ref={outerRingRef} position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.4, 4.46, 64]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={innerRingRef} position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.84, 48]} />
        <meshBasicMaterial
          color="#00B8F5"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center Hologram Emitter Beacon */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.1, 32]} />
        <meshStandardMaterial
          color="#050E22"
          metalness={0.9}
          roughness={0.2}
          emissive={activeColor}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
};
