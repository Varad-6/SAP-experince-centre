import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';

type CardData = z.infer<typeof CardSchema>;

export const WorkflowCard: React.FC<{ card: CardData }> = ({ card }) => {
  const steps = card.steps || [];

  return (
    <div className="space-y-3.5">
      {steps.map((st) => (
        <div
          key={st.step}
          className="p-4 sm:p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-50)] text-[var(--brand-600)] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              0{st.step}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--navy)] mb-0.5">{st.title}</h4>
              {(() => {
                const cleanDesc = st.desc && st.desc.startsWith(st.title)
                  ? st.desc.slice(st.title.length).replace(/^[\s:–—-]+/, '').trim()
                  : st.desc;
                return cleanDesc && cleanDesc !== st.title ? (
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed">{cleanDesc}</p>
                ) : null;
              })()}
            </div>
          </div>

          <div className="shrink-0 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-xs font-mono font-semibold text-[var(--navy)] shadow-xs self-start sm:self-center">
            {st.sapAction}
          </div>
        </div>
      ))}
    </div>
  );
};
