'use client';

import React from 'react';
import pillarsData from '@/content/pillars.json';
import { PillarTile } from './PillarTile';

export const PillarsRing: React.FC = () => {
  return (
    <group>
      {pillarsData.map((p, index) => (
        <PillarTile
          key={p.id}
          id={p.id}
          index={index}
          total={pillarsData.length}
          title={p.title}
          accent={p.accent}
        />
      ))}
    </group>
  );
};
