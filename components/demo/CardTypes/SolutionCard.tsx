import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const SolutionCard: React.FC<{ card: CardData }> = ({ card }) => {
  const nodes = card.diagram?.nodes || [];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#0070F2]/10 border border-[#00B8F5]/20 text-xs text-[#00B8F5] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#00C8F8]" />
        <span>Interactive Clean Core Directed Acyclic Graph (DAG) Pipeline</span>
      </div>

      {/* Interactive Node Flow */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 rounded-2xl bg-[#0A1F44]/60 border border-white/10">
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <div className="flex-1 w-full text-center p-4 rounded-xl bg-[#102A5C]/70 border border-[#00B8F5]/30 hover:border-[#00B8F5] transition-all hover:scale-105 shadow-lg">
              <span className="block text-[10px] font-mono text-[#00B8F5] mb-1">
                STAGE 0{i + 1}
              </span>
              <span className="text-xs font-bold text-white block">
                {node.label}
              </span>
            </div>
            {i < nodes.length - 1 && (
              <div className="shrink-0 text-[#00B8F5] flex items-center justify-center py-2 sm:py-0">
                <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0 animate-pulse" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-xs text-[#9FB3D1] text-center italic">
        Zero modifications inside SAP S/4HANA core. All business logic executes securely in SAP BTP.
      </p>
    </div>
  );
};
