import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { CheckCircle2, ArrowRight } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const WorkflowCard: React.FC<{ card: CardData }> = ({ card }) => {
  const steps = card.steps || [];

  return (
    <div className="space-y-4">
      {steps.map((st) => (
        <div
          key={st.step}
          className="p-5 rounded-2xl bg-[#0A1F44]/60 border border-white/10 hover:border-[#00B8F5]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#0070F2]/20 border border-[#00B8F5]/30 text-[#00B8F5] font-mono font-bold text-sm flex items-center justify-center shrink-0">
              0{st.step}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">{st.title}</h4>
              <p className="text-xs text-[#9FB3D1] leading-relaxed">{st.desc}</p>
            </div>
          </div>

          <div className="shrink-0 px-3 py-1.5 rounded-lg bg-[#102A5C] border border-[#00B8F5]/30 text-xs font-mono text-[#00B8F5] self-end sm:self-center">
            {st.sapAction}
          </div>
        </div>
      ))}
    </div>
  );
};
