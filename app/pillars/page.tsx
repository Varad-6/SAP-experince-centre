'use client';

import React from 'react';
import Link from 'next/link';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ArrowRight, Layers, Box, Cpu, Zap, BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';
import { audio } from '@/lib/audio';

const iconMap: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-7 h-7 text-[#0070F2]" />,
  Box: <Box className="w-7 h-7 text-[#00B8F5]" />,
  Cpu: <Cpu className="w-7 h-7 text-[#8B5CF6]" />,
  Zap: <Zap className="w-7 h-7 text-[#F0AB00]" />,
  BarChart3: <BarChart3 className="w-7 h-7 text-[#19C3A6]" />,
};

export default function PillarsHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Executive Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#0070F2]/15 text-[#00B8F5] border border-[#00B8F5]/30 mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CLEAN CORE ARCHITECTURAL HUBS</span>
        </div>
        <h1 className="text-h1 font-bold text-white mb-4">
          The 5 Pillars of Enterprise SAP Excellence
        </h1>
        <p className="text-body text-[#9FB3D1]">
          Select any architectural pillar below to explore our 28 production solutions, custom BTP applications, agentic AI copilots, and real-time executive cockpits.
        </p>
      </div>

      {/* 5 Prominent Pillar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillarsData.map((pillar) => {
          const count = solutionsData.filter((s) => s.pillarId === pillar.id).length;
          return (
            <Link
              key={pillar.id}
              href={`/pillar/${pillar.id}`}
              onClick={() => {
                audio.play('pillar_select');
              }}
              className="group block"
            >
              <GlassPanel
                glowColor={pillar.accent}
                className="p-8 h-full flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer border border-white/10 hover:border-white/25"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg"
                      style={{
                        backgroundColor: `${pillar.accent}20`,
                        borderColor: `${pillar.accent}40`,
                      }}
                    >
                      {iconMap[pillar.icon] || <Layers className="w-7 h-7 text-white" />}
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
                      style={{
                        color: pillar.accent,
                        borderColor: `${pillar.accent}40`,
                        backgroundColor: `${pillar.accent}15`,
                      }}
                    >
                      {count} Solutions
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-[#9FB3D1] uppercase tracking-wider block mb-1">
                    Pillar 0{pillar.order}
                  </span>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00B8F5] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#9FB3D1] leading-relaxed mb-6">
                    {pillar.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-white/10 text-xs font-mono">
                  <span className="text-[#3DDC97] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Clean Core Certified
                  </span>
                  <span className="text-white group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5 font-bold">
                    <span>Explore Pillar</span>
                    <ArrowRight className="w-4 h-4 text-[#00B8F5]" />
                  </span>
                </div>
              </GlassPanel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
