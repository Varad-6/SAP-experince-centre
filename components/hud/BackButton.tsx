'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/store';

export const BackButton: React.FC = () => {
  const { scene, goLanding, goPillars, exitDemo } = useStore();

  if (scene === 'LANDING') return null;

  const handleClick = () => {
    if (scene === 'DEMO' || scene === 'DEMO_END') {
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
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--brand)] transition-colors cursor-pointer"
      title="Back (Esc)"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-[var(--brand)]" />
      <span>Back</span>
    </button>
  );
};
