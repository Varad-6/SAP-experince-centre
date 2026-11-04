'use client';

import React from 'react';
import { useStore } from '@/lib/store';

const CARD_LABELS = [
  'Hook',
  'Challenge',
  'Solution',
  'Live UI',
  'Workflow',
  'Tech Stack',
  'Impact',
  'Action',
];

export const ProgressDots: React.FC<{ current: number; total?: number }> = ({
  current,
  total = 8,
}) => {
  const { setCardIndex } = useStore();

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = current === i;
        const isPast = current > i;
        return (
          <button
            key={i}
            onClick={() => {
              setCardIndex(i);
            }}
            title={`Jump to Card ${i + 1}: ${CARD_LABELS[i] || ''}`}
            className={`group relative h-2 rounded-full transition-all duration-300 cursor-pointer ${
              isActive
                ? 'w-8 bg-gradient-to-r from-[#0070F2] to-[#00B8F5] shadow-[0_0_12px_#00B8F5]'
                : isPast
                ? 'w-2 bg-[#00B8F5]/60 hover:bg-[#00B8F5]'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          >
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono text-white bg-[#0A1F44] border border-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              {i + 1}. {CARD_LABELS[i]}
            </span>
          </button>
        );
      })}
    </div>
  );
};
