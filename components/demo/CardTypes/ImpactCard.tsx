import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';

type CardData = z.infer<typeof CardSchema>;

export const ImpactCard: React.FC<{ card: CardData }> = ({ card }) => {
  const metrics = card.metrics || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-5 sm:p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center shadow-xs transition-all hover:-translate-y-0.5"
          >
            <div className="text-3xl sm:text-4xl font-black text-[var(--ok)] mb-2 tracking-tight">
              {m.value}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[var(--navy)] mb-2 uppercase tracking-wide">
              {m.label}
            </h4>
            {m.delta && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7ED] text-[var(--ok)]">
                {m.delta}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-center text-xs text-[var(--text-dim)]">
        Production baseline benchmarked across enterprise heavy-industry SAP S/4HANA landscapes.
      </div>
    </div>
  );
};
