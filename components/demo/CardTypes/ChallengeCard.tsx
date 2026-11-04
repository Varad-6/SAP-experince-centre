import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const ChallengeCard: React.FC<{ card: CardData }> = ({ card }) => {
  const bullets = card.bullets && card.bullets.length > 0 ? card.bullets : [
    'Legacy customization sprawl creates technical debt and prevents seamless cloud upgrades.',
    'Asynchronous multi-system data synchronization introduces latency and reconciliation backlogs.',
    'Lack of centralized enterprise visibility impedes rapid operational decision-making.'
  ];

  const frictionPoints = bullets.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Operational Friction */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#FFF5F5] border border-[#FED7D7]">
          <div className="flex items-center gap-2 mb-3 text-[var(--danger)]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Legacy Friction & Root Cause</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text)]">
            {frictionPoints.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[var(--danger)] font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clean Core Target State */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#E6F7ED] border border-[#A6E9BD]">
          <div className="flex items-center gap-2 mb-3 text-[var(--ok)]">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">AIS Clean Core Target State</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--ok)] font-bold mt-0.5">•</span>
              <span className="leading-relaxed">Decoupled extension architecture operating on SAP BTP.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--ok)] font-bold mt-0.5">•</span>
              <span className="leading-relaxed">Real-time sub-second data processing with zero standard core modifications.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--ok)] font-bold mt-0.5">•</span>
              <span className="leading-relaxed">Complete audit traceability and automated quarterly upgrade safety.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Additional Challenge Context if available */}
      {bullets.length > 3 && (
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] space-y-1.5">
          <span className="font-semibold text-[var(--navy)] block mb-1">Extended Process Impacts:</span>
          {bullets.slice(3).map((b, i) => (
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
