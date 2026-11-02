'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';

export const BackButton: React.FC = () => {
  const { scene, goLanding, goPillars, exitDemo } = useStore();

  if (scene === 'LANDING') return null;

  const handleClick = () => {
    audio.play('ui_click');
    if (scene === 'DEMO' || scene === 'DEMO_INTRO' || scene === 'DEMO_END') {
      exitDemo();
    } else if (scene === 'PROJECT' || scene === 'PILLAR') {
      goPillars();
    } else if (scene === 'PILLARS') {
      goLanding();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#102A5C]/40 border border-white/10 text-xs font-mono tracking-wider text-[#9FB3D1] hover:text-[#EAF2FF] hover:border-white/25 hover:bg-[#102A5C]/70 backdrop-blur-md transition-all cursor-pointer"
      title="Back (Esc)"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-[#00B8F5]" />
      <span>BACK</span>
    </button>
  );
};
