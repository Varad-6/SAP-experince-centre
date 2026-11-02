import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { TrendingUp, Award, Zap } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const ImpactCard: React.FC<{ card: CardData }> = ({ card }) => {
  const metrics = card.metrics || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[#0A1F44]/80 border border-[#00B8F5]/30 text-center shadow-lg hover:scale-105 transition-all"
          >
            <div className="text-3xl sm:text-4xl font-black text-[#3DDC97] mb-2">
              {m.value}
            </div>
            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">
              {m.label}
            </h4>
            {m.delta && (
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#0070F2]/20 text-[#00B8F5] border border-[#00B8F5]/30">
                {m.delta}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-[#9FB3D1]">
        Production baseline benchmarked across enterprise heavy-industry SAP S/4HANA landscapes.
      </div>
    </div>
  );
};
