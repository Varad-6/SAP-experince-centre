'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { BotSprite } from '@/components/BotSprite';
import { BotBubble } from '@/components/BotBubble';
import { ArrowRight, Layers, Box, Cpu, Zap, BarChart3, ShieldCheck } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-6 h-6" />,
  Box: <Box className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
};

export default function PillarsHubPage() {
  const [showBubble, setShowBubble] = useState<boolean>(true);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[var(--bg)] text-[var(--text)] px-6 sm:px-8 py-10 sm:py-14 max-w-[1200px] mx-auto relative pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10 sm:mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-50)] text-[var(--brand)] text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE ARCHITECTURE HUBS</span>
          </div>
          <h1 className="text-h1 font-bold text-[var(--navy)] tracking-tight mb-3">
            The 3 Pillars of Enterprise SAP Excellence
          </h1>
          <p className="text-base text-[var(--text-dim)] leading-relaxed">
            Select an architectural pillar to inspect our production solutions, custom BTP applications, data modernization pipelines, and real-time executive steering.
          </p>
        </div>
      </div>

      {/* Symmetrical 3-Pillar Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {pillarsData.map((pillar) => {
          const solutionCount = solutionsData.filter((s) => s.pillarId === pillar.id).length;

          return (
            <Link
              key={pillar.id}
              href={`/pillar/${pillar.id}`}
              className="group card flex flex-col justify-between p-6 sm:p-7 relative transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[var(--shadow-lg)] h-full"
              style={{
                borderTop: `3px solid ${pillar.accent}`,
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${pillar.accent}15`,
                      color: pillar.accent,
                    }}
                  >
                    {iconMap[pillar.icon] || <Layers className="w-6 h-6" />}
                  </div>

                  <span className="chip">
                    {solutionCount} solutions
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--brand)] transition-colors leading-tight">
                  {pillar.title}
                </h2>

                <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed mb-6">
                  {pillar.tagline}
                </p>
              </div>

              <div className="flex items-center text-xs font-semibold text-[var(--brand)] group-hover:translate-x-1 transition-transform mt-auto pt-3 border-t border-[var(--border)]/50">
                <span>Inspect solutions</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Docked Bot in bottom right with speech bubble */}
      <aside
        className="fixed bottom-6 right-6 z-30 flex items-end gap-3 pointer-events-auto"
        onMouseEnter={() => setShowBubble(true)}
      >
        {/* Thinking Speech Bubble */}
        {showBubble && (
          <BotBubble
            text="Pick a pillar to explore."
            durationMs={5000}
            placement="left"
            onDismiss={() => setShowBubble(false)}
          />
        )}

        {/* Bot Avatar */}
        <div
          className="relative cursor-pointer group shrink-0"
          onClick={() => setShowBubble((prev) => !prev)}
        >
          <BotSprite pose="idle" heightPx={130} alt="Docked Aayam Guide" />
          <div className="w-16 h-2 bg-black/10 rounded-full blur-[2px] mx-auto mt-[-4px]" />
        </div>
      </aside>
    </div>
  );
}
