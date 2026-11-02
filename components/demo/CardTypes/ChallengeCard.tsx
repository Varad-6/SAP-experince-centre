import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { AlertTriangle, Clock, FileWarning, ArrowRight } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const ChallengeCard: React.FC<{ card: CardData }> = ({ card }) => {
  return (
    <div className="space-y-6">
      {/* Before / After Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Legacy Bottleneck */}
        <div className="p-5 rounded-2xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/25">
          <div className="flex items-center gap-2 mb-3 text-[#FF5C5C]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">Legacy Process</span>
          </div>
          <ul className="space-y-2 text-xs text-[#EAF2FF]">
            <li className="flex items-start gap-2">
              <span className="text-[#FF5C5C] font-bold">•</span>
              <span>Manual paper slips taking 4-7 days to reconcile into SAP.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF5C5C] font-bold">•</span>
              <span>Demurrage penalty charges on railcar holding tracks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF5C5C] font-bold">•</span>
              <span>Billing friction and cash flow withholding disputes.</span>
            </li>
          </ul>
        </div>

        {/* AIS Autonomous Flow */}
        <div className="p-5 rounded-2xl bg-[#3DDC97]/10 border border-[#3DDC97]/25">
          <div className="flex items-center gap-2 mb-3 text-[#3DDC97]">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">AIS Modern Flow</span>
          </div>
          <ul className="space-y-2 text-xs text-[#EAF2FF]">
            <li className="flex items-start gap-2">
              <span className="text-[#3DDC97] font-bold">•</span>
              <span>Automated computer vision OCR in &lt;30 seconds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3DDC97] font-bold">•</span>
              <span>Direct S/4HANA MIRO touchless ledger posting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3DDC97] font-bold">•</span>
              <span>100% audit trail with Clean Core extensibility.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bullets */}
      {card.bullets && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#9FB3D1] space-y-1.5">
          {card.bullets.map((b, i) => (
            <p key={i} className="flex items-center gap-2">
              <span className="text-[#00B8F5]">→</span> {b}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
