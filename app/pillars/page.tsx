'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { BotSprite } from '@/components/BotSprite';
import { BotBubble } from '@/components/BotBubble';
import { ArrowLeft, ArrowRight, Layers, Box, Cpu, Zap, BarChart3, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-56px)] bg-transparent text-[var(--text)] px-6 sm:px-8 py-8 sm:py-10 max-w-[1200px] mx-auto relative pb-32">
      {/* Back to Home Button */}
      <div className="mb-6">
        <Link
          href="/"
          prefetch={true}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--navy)] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10 sm:mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-50)] text-[var(--brand)] text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE ARCHITECTURE HUBS</span>
          </div>
          <h1 className="text-h1 font-bold text-[var(--navy)] tracking-tight mb-3">
            Enterprise Architecture &amp; Business AI Hubs
          </h1>
          <p className="text-base text-[var(--text-dim)] leading-relaxed">
            Select an architectural pillar to inspect our production solutions, custom BTP applications, data modernization pipelines, real-time executive steering, and SAP Business AI agents.
          </p>
        </div>
      </div>

      {/* Symmetrical 4-Pillar Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {pillarsData.map((pillar) => {
          const solutionCount =
            pillar.id === 'p4'
              ? 20
              : solutionsData.filter((s) => s.pillarId === pillar.id).length;

          return (
            <Link
              key={pillar.id}
              href={`/pillar/${pillar.id}`}
              prefetch={true}
              className="group card flex flex-col justify-between p-6 relative transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[var(--shadow-lg)] h-full"
              style={{
                borderTop: `3px solid ${pillar.accent}`,
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${pillar.accent}15`,
                      color: pillar.accent,
                    }}
                  >
                    {iconMap[pillar.icon] || <Layers className="w-5 h-5" />}
                  </div>

                  {pillar.comingSoon ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="chip text-xs">
                      {solutionCount} solutions
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--brand)] transition-colors leading-snug">
                  {pillar.title}
                </h2>

                <p className="text-xs text-[var(--text-dim)] leading-relaxed mb-6">
                  {pillar.tagline}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[var(--brand)] group-hover:translate-x-0.5 transition-transform mt-auto pt-3 border-t border-[var(--border)]/50">
                <span>{pillar.comingSoon ? 'Explore AI use cases' : 'Inspect solutions'}</span>
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
