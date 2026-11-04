import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const ImpactCard: React.FC<{ card: CardData }> = ({ card }) => {
  const metrics = card.metrics || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => {
          // Parse delta percentage or fallback to baseline width
          const deltaNum = m.delta ? parseInt(m.delta.replace(/[^0-9]/g, '')) || 70 : 80;
          const barWidth = Math.min(100, Math.max(25, deltaNum));

          return (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-left shadow-xs transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-[var(--ok)] tracking-tight">
                  {m.value}
                </span>
                {m.delta && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7ED] text-[var(--ok)]">
                    <TrendingUp size={12} />
                    <span>{m.delta}</span>
                  </span>
                )}
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-[var(--navy)] mb-3 uppercase tracking-wide">
                {m.label}
              </h4>

              {/* Animated ROI Delta Bar */}
              <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden mb-1">
                <div
                  className="bg-[var(--ok)] h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-dim)] font-mono">
                <span>Baseline</span>
                <span className="text-[var(--ok)] font-semibold">Clean Core Impact</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-center text-xs text-[var(--text-dim)] flex items-center justify-center gap-2">
        <CheckCircle2 size={14} className="text-[var(--ok)]" />
        <span>Production baseline benchmarked across enterprise heavy-industry SAP S/4HANA landscapes.</span>
      </div>
    </div>
  );
};
