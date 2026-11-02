'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';
import { Text } from '@react-three/drei';

export interface PillarTileProps {
  id: string;
  index: number;
  total: number;
  title: string;
  accent: string;
  radius?: number;
}

export const PillarTile: React.FC<PillarTileProps> = ({
  id,
  index,
  total,
  title,
  accent,
  radius = 3.6,
}) => {
  const { pillarId, openPillar, scene } = useStore();
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const angle = (index * (2 * Math.PI)) / total - Math.PI / 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const isSelected = pillarId === id;

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Floating bob animation
      meshRef.current.position.y = Math.sin(time * 2 + index) * 0.12 + 0.6;
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.x = Math.sin(time * 1.5) * 0.1;
    }
  });

  if (scene !== 'PILLARS' && scene !== 'PILLAR' && scene !== 'LANDING') {
    return null;
  }

  return (
    <group position={[x, -1.6, z]}>
      {/* Pedestal Base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.4, 24]} />
        <meshStandardMaterial
          color="#0A1F44"
          metalness={0.8}
          roughness={0.3}
          emissive={isSelected ? accent : '#001A40'}
          emissiveIntensity={isSelected ? 0.6 : 0.2}
        />
      </mesh>

      {/* Glowing Floating Crystal */}
      <mesh
        ref={meshRef}
        position={[0, 0.6, 0]}
        scale={hovered || isSelected ? 1.25 : 1.0}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
          audio.play('ui_hover');
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          audio.play('pillar_select');
          openPillar(id);
        }}
      >
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={hovered || isSelected ? 0.9 : 0.45}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Floating 3D Pillar Label */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.22}
        color={isSelected ? '#FFFFFF' : '#9FB3D1'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
      >
        {`P${index + 1}`}
      </Text>
    </group>
  );
};
