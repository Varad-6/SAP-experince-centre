import React from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { Cpu, Server, Globe, Database, Shield } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

const layerIcon: Record<string, React.ReactNode> = {
  Runtime: <Server className="w-4 h-4 text-[#0070F2]" />,
  Backend: <Database className="w-4 h-4 text-[#00B8F5]" />,
  AI: <Cpu className="w-4 h-4 text-[#8B5CF6]" />,
  'AI & Vision': <Cpu className="w-4 h-4 text-[#8B5CF6]" />,
  Portal: <Globe className="w-4 h-4 text-[#19C3A6]" />,
  'Enterprise Portal': <Globe className="w-4 h-4 text-[#19C3A6]" />,
  ERP: <Shield className="w-4 h-4 text-[#F0AB00]" />,
  'Core ERP': <Shield className="w-4 h-4 text-[#F0AB00]" />,
};

export const TechStackCard: React.FC<{ card: CardData }> = ({ card }) => {
  const chips = card.chips || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chips.map((chip, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#0A1F44]/60 border border-white/10 hover:border-[#00B8F5]/40 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                {layerIcon[chip.layer] || <Server className="w-4 h-4 text-[#00B8F5]" />}
              </div>
              <div>
                <span className="block text-[10px] font-mono text-[#9FB3D1] uppercase">
                  {chip.layer}
                </span>
                <span className="text-xs font-bold text-white">
                  {chip.tech}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#3DDC97] bg-[#3DDC97]/10 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-[#0070F2]/10 border border-[#00B8F5]/20 text-xs text-[#EAF2FF] text-center font-mono">
        Clean Core Certified: Decoupled via SAP Destination Service & Cloud Connector.
      </div>
    </div>
  );
};
