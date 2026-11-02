'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';

export const Drone: React.FC = () => {
  const { droneState, setDroneState, setBotState } = useStore();
  const groupRef = useRef<THREE.Group>(null!);
  const rotorRefs = useRef<THREE.Mesh[]>([]);
  const dropTimer = useRef(0);

  useFrame((_, delta) => {
    // Spin rotors continuously if active
    rotorRefs.current.forEach((r) => {
      if (r) r.rotation.y += delta * 35;
    });

    if (!groupRef.current) return;

    if (droneState === 'hidden') {
      groupRef.current.position.set(0, 15, 0);
      dropTimer.current = 0;
    } else if (
      droneState === 'hovering' ||
      droneState === 'dropping' ||
      droneState === 'lifting'
    ) {
      dropTimer.current += delta;

      if (droneState === 'hovering' && dropTimer.current === delta) {
        audio.play('drone_arrive');
      }

      // Fly down from high to pedestal
      if (dropTimer.current < 1.2) {
        const t = dropTimer.current / 1.2;
        groupRef.current.position.y = THREE.MathUtils.lerp(8, 0.4, t);
        groupRef.current.position.z = THREE.MathUtils.lerp(4, 0.2, t);
        groupRef.current.rotation.x = Math.sin(t * Math.PI) * 0.2;
      } else if (dropTimer.current < 1.8) {
        // Drop point: release bot
        if (droneState !== 'dropping') {
          audio.play('drone_drop');
          setDroneState('dropping');
          setBotState('explain');
        }
        groupRef.current.position.y = 0.4 + Math.sin(dropTimer.current * 8) * 0.05;
      } else if (dropTimer.current < 3.0) {
        // Lift off and exit
        if (droneState !== 'lifting') {
          audio.play('drone_leave');
          setDroneState('lifting');
        }
        const t = (dropTimer.current - 1.8) / 1.2;
        groupRef.current.position.y = THREE.MathUtils.lerp(0.4, 10, t);
        groupRef.current.position.x = THREE.MathUtils.lerp(0, 5, t);
        groupRef.current.rotation.z = -t * 0.3;
      } else {
        setDroneState('hidden');
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 15, 0]}>
      {/* Quadcopter Main Capsule Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 16]} />
        <meshStandardMaterial
          color="#EAF2FF"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing Cyan Sensor Ring Underbelly */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.26, 32]} />
        <meshBasicMaterial color="#00B8F5" side={THREE.DoubleSide} />
      </mesh>

      {/* Eye Visor */}
      <mesh position={[0, 0.08, 0.28]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.12, 0.1]} />
        <meshStandardMaterial
          color="#0A1F44"
          emissive="#00C8F8"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 4 Carbon Fiber Rotor Arms and Blades */}
      {[
        [-0.45, 0.1, -0.45],
        [0.45, 0.1, -0.45],
        [-0.45, 0.1, 0.45],
        [0.45, 0.1, 0.45],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[-x * 0.4, -0.05, -z * 0.4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial color="#0A1F44" metalness={0.9} />
          </mesh>
          <mesh
            ref={(el) => {
              if (el) rotorRefs.current[i] = el;
            }}
            position={[0, 0.05, 0]}
          >
            <boxGeometry args={[0.42, 0.01, 0.04]} />
            <meshStandardMaterial
              color="#00B8F5"
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* Retractable Magnetic Claw */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.08, 0.15, 12]} />
        <meshStandardMaterial color="#102A5C" metalness={0.8} />
      </mesh>
    </group>
  );
};
