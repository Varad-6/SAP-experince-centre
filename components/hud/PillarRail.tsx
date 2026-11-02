'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';

const PILLARS_CONFIG = [
  { id: 'p1', label: 'P1', name: 'Foundation', color: '#0070F2' },
  { id: 'p2', label: 'P2', name: 'BTP Apps', color: '#00B8F5' },
  { id: 'p3', label: 'P3', name: 'AI & Joule', color: '#8B5CF6' },
  { id: 'p4', label: 'P4', name: 'HanaMorph', color: '#F0AB00' },
  { id: 'p5', label: 'P5', name: 'SAC Dashboards', color: '#19C3A6' },
];

export const PillarRail: React.FC = () => {
  const { pillarId, openPillar, scene } = useStore();

  if (scene === 'DEMO' || scene === 'DEMO_INTRO') return null;

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-2.5 p-2 rounded-2xl bg-[#0A1F44]/40 backdrop-blur-xl border border-white/10 shadow-2xl">
      {PILLARS_CONFIG.map((p) => {
        const isActive = pillarId === p.id;
        return (
          <button
            key={p.id}
            onClick={() => {
              audio.play('pillar_select');
              openPillar(p.id);
            }}
            className={`group relative w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-white border'
                : 'text-[#9FB3D1] hover:text-white border border-transparent hover:border-white/20 hover:bg-white/5'
            }`}
            style={{
              borderColor: isActive ? p.color : undefined,
              backgroundColor: isActive ? `${p.color}33` : undefined,
              boxShadow: isActive ? `0 0 16px ${p.color}66` : undefined,
            }}
          >
            <span>{p.label}</span>
            {/* Tooltip on right */}
            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#0A1F44]/95 border border-white/15 text-xs text-white font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
