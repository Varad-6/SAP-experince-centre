'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Bot } from 'lucide-react';

export interface CaptionBarProps {
  dialogue?: string;
}

export const CaptionBar: React.FC<CaptionBarProps> = ({ dialogue }) => {
  const { captions, scene } = useStore();

  if (!captions || !dialogue) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[90%] pointer-events-none animate-in fade-in slide-in-from-bottom-2">
      <div className="px-5 py-3 rounded-2xl bg-[#0A1F44]/90 backdrop-blur-xl border border-[#00B8F5]/30 text-center shadow-2xl flex items-center justify-center gap-3">
        <div className="w-7 h-7 rounded-full bg-[#0070F2]/20 border border-[#0070F2]/40 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-[#00B8F5]" />
        </div>
        <p className="text-sm text-[#EAF2FF] font-medium leading-relaxed">
          {dialogue}
        </p>
      </div>
    </div>
  );
};
