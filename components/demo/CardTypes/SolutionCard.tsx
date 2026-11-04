import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { ArrowRight, ShieldCheck } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const SolutionCard: React.FC<{ card: CardData }> = ({ card }) => {
  const nodes = card.diagram?.nodes || [];

  return (
    <div className="space-y-6">
      <div className="p-3 sm:p-4 rounded-xl bg-[var(--brand-50)] border border-[var(--border)] text-xs font-medium text-[var(--brand-600)] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[var(--brand)] shrink-0" />
        <span>Decoupled Clean Core Directed Acyclic Graph (DAG) Pipeline</span>
      </div>

      {/* Interactive Node Flow */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 sm:p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <div className="flex-1 w-full text-center p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--brand)]">
              <span className="block text-[10px] font-mono font-bold text-[var(--brand)] mb-1 uppercase tracking-wider">
                STAGE 0{i + 1}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--navy)] block leading-snug">
                {node.label}
              </span>
            </div>
            {i < nodes.length - 1 && (
              <div className="shrink-0 text-[var(--brand)] flex items-center justify-center py-2 sm:py-0">
                <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-xs text-[var(--text-dim)] text-center">
        Zero modifications inside SAP S/4HANA core. All business logic executes securely in SAP BTP.
      </p>
    </div>
  );
};
