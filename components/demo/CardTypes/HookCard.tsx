import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const HookCard: React.FC<{ card: CardData }> = ({ card }) => {
  return (
    <div className="space-y-6">
      {/* Hero Stat Box */}
      {card.stat && (
        <div className="p-6 sm:p-7 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="text-4xl sm:text-5xl font-black text-[var(--brand)] tracking-tight shrink-0">
            {card.stat.number}
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-[var(--navy)] mb-1">
              {card.stat.label}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed">
              Deterministic validation rate across active S/4HANA enterprise transaction pipelines.
            </p>
          </div>
        </div>
      )}

      {/* Value Bullets */}
      {card.bullets && (
        <ul className="space-y-3">
          {card.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--text)]">
              <div className="p-1 rounded-full bg-[#E6F7ED] text-[var(--ok)] shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="leading-relaxed font-medium">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
