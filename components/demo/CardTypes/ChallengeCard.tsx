import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const ChallengeCard: React.FC<{ card: CardData }> = ({ card }) => {
  return (
    <div className="space-y-6">
      {/* Before / After Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Legacy Bottleneck */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#FFF5F5] border border-[#FED7D7]">
          <div className="flex items-center gap-2 mb-3 text-[var(--danger)]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Legacy Friction</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[var(--text)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] font-bold">•</span>
              <span>Manual paper slips taking 4–7 days to reconcile into SAP.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] font-bold">•</span>
              <span>Demurrage penalty charges on railcar holding tracks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] font-bold">•</span>
              <span>Billing friction and cash flow withholding disputes.</span>
            </li>
          </ul>
        </div>

        {/* AIS Autonomous Flow */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#E6F7ED] border border-[#A6E9BD]">
          <div className="flex items-center gap-2 mb-3 text-[var(--ok)]">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">AIS Modern Flow</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[var(--text)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--ok)] font-bold">•</span>
              <span>Automated computer vision OCR in &lt;30 seconds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--ok)] font-bold">•</span>
              <span>Direct S/4HANA MIRO touchless ledger posting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--ok)] font-bold">•</span>
              <span>100% audit trail with Clean Core extensibility.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Summary Bullets */}
      {card.bullets && (
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] space-y-1.5">
          <span className="font-semibold text-[var(--navy)] block mb-1">Key Operational Challenges:</span>
          {card.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2 text-[var(--text-dim)]">
              <span className="text-[var(--brand)] font-bold">•</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
