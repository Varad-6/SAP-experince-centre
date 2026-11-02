'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Layers, Box, Cpu, Zap, BarChart3, CheckCircle2 } from 'lucide-react';
import { audio } from '@/lib/audio';

const iconMap: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-6 h-6 text-[#0070F2]" />,
  Box: <Box className="w-6 h-6 text-[#00B8F5]" />,
  Cpu: <Cpu className="w-6 h-6 text-[#8B5CF6]" />,
  Zap: <Zap className="w-6 h-6 text-[#F0AB00]" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-[#19C3A6]" />,
};

export default function PillarsHubPage() {
  const { setScene, openPillar } = useStore();

  useEffect(() => {
    setScene('PILLARS');
  }, [setScene]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#0070F2]/15 text-[#00B8F5] border border-[#00B8F5]/30 mb-4">
          CLEAN CORE ARCHITECTURAL HUBS
        </span>
        <h1 className="text-h1 font-bold text-white mb-4">
          5 Pillars of Enterprise Excellence
        </h1>
        <p className="text-body text-[#9FB3D1]">
          Explore 28 production-tested SAP solutions categorized across foundational infrastructure, custom BTP applications, agentic AI, migration accelerators, and executive analytics.
        </p>
      </div>

      {/* 5 Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillarsData.map((pillar) => {
          const count = solutionsData.filter((s) => s.pillarId === pillar.id).length;
          return (
            <Link
              key={pillar.id}
              href={`/pillar/${pillar.id}`}
              onClick={() => {
                audio.play('pillar_select');
                openPillar(pillar.id);
              }}
              className="group block"
            >
              <GlassPanel
                glowColor={pillar.accent}
                className="p-7 h-full flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${pillar.accent}20`,
                        borderColor: `${pillar.accent}40`,
                      }}
                    >
                      {iconMap[pillar.icon] || <Layers className="w-6 h-6 text-white" />}
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-mono font-bold border"
                      style={{
                        color: pillar.accent,
                        borderColor: `${pillar.accent}40`,
                        backgroundColor: `${pillar.accent}15`,
                      }}
                    >
                      {count} Solutions
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00B8F5] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-[#9FB3D1] leading-relaxed mb-6">
                    {pillar.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
                  <span className="text-[#9FB3D1] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC97]" /> Clean Core
                  </span>
                  <span className="text-white group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explore Pillar <ArrowRight className="w-3.5 h-3.5 text-[#00B8F5]" />
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
