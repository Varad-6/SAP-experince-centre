import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { Cpu, Server, Globe, Database, Shield } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

const layerIcon: Record<string, React.ReactNode> = {
  Runtime: <Server className="w-4 h-4 text-[var(--brand)]" />,
  Backend: <Database className="w-4 h-4 text-[var(--brand)]" />,
  AI: <Cpu className="w-4 h-4 text-[var(--brand)]" />,
  'AI & Vision': <Cpu className="w-4 h-4 text-[var(--brand)]" />,
  Portal: <Globe className="w-4 h-4 text-[var(--brand)]" />,
  'Enterprise Portal': <Globe className="w-4 h-4 text-[var(--brand)]" />,
  ERP: <Shield className="w-4 h-4 text-[var(--warn)]" />,
  'Core ERP': <Shield className="w-4 h-4 text-[var(--warn)]" />,
};

export const TechStackCard: React.FC<{ card: CardData }> = ({ card }) => {
  const chips = card.chips || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chips.map((chip, i) => (
          <div
            key={i}
            className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                {layerIcon[chip.layer] || <Server className="w-4 h-4 text-[var(--brand)]" />}
              </div>
              <div>
                <span className="block text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider">
                  {chip.layer}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[var(--navy)]">
                  {chip.tech}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[var(--ok)] bg-[#E6F7ED] px-2 py-0.5 rounded-full">
              Production
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-[var(--brand-50)] border border-[var(--border)] text-xs text-[var(--brand-600)] text-center font-medium">
        SAP BTP Cloud Foundry + S/4HANA Public Cloud 2026 Architectural Baseline
      </div>
    </div>
  );
};
