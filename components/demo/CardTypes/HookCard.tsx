import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { Sparkles, CheckCircle2 } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const HookCard: React.FC<{ card: CardData }> = ({ card }) => {
  return (
    <div className="space-y-6">
      {/* Hero Stat Box */}
      {card.stat && (
        <div className="p-6 rounded-2xl bg-[#0070F2]/10 border border-[#00B8F5]/30 flex flex-col sm:flex-row items-center gap-6">
          <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-[#00C8F8] to-[#0070F2] bg-clip-text text-transparent">
            {card.stat.number}
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-1">{card.stat.label}</h4>
            <p className="text-xs text-[#9FB3D1]">
              Deterministic validation rate across active S/4HANA enterprise transaction pipelines.
            </p>
          </div>
        </div>
      )}

      {/* Value Bullets */}
      {card.bullets && (
        <ul className="space-y-3">
          {card.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#EAF2FF]">
              <div className="p-1 rounded-full bg-[#3DDC97]/20 text-[#3DDC97] shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
