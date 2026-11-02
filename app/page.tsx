'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import siteData from '@/content/site.json';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Box,
  Cpu,
  Zap,
  BarChart3,
  Presentation,
  Play,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { audio } from '@/lib/audio';

const pillarIcons: Record<string, React.ElementType> = {
  p1: Layers,
  p2: Box,
  p3: Cpu,
  p4: Zap,
  p5: BarChart3,
};

export default function HomePage() {
  const [selectedPillar, setSelectedPillar] = useState<string>('all');

  const filteredSolutions =
    selectedPillar === 'all'
      ? solutionsData
      : solutionsData.filter((s) => s.pillarId === selectedPillar);

  return (
    <div className="min-h-screen pb-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#0070F2]/15 text-[#00B8F5] border border-[#00B8F5]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#00C8F8] animate-spin" style={{ animationDuration: '6s' }} />
                <span>{siteData.brand.toUpperCase()} — ENTERPRISE PORTFOLIO</span>
              </div>

              <h1 className="text-display font-extrabold text-white leading-tight">
                {siteData.heroTitle}
              </h1>

              <p className="text-body text-[#9FB3D1] max-w-2xl leading-relaxed">
                {siteData.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/pillars">
                  <Button size="lg" variant="primary" glow className="gap-2.5">
                    <span>Enter 3D Experience Centre</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/solution/podzo/demo">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Play className="w-4 h-4 fill-current text-[#00B8F5]" />
                    <span>Watch Flagship Demo (PODZO)</span>
                  </Button>
                </Link>

                <Link href="/present">
                  <Button size="lg" variant="glass" className="gap-2">
                    <Presentation className="w-4 h-4 text-[#00B8F5]" />
                    <span>Present Mode</span>
                  </Button>
                </Link>
              </div>

              {/* Live Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                {siteData.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-[#9FB3D1] font-medium mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Live Production Spotlight Card */}
            <div className="lg:col-span-5 relative">
              <GlassPanel glowColor="#0070F2" className="p-6 relative group overflow-hidden">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5C5C]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F0AB00]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3DDC97]" />
                  </div>
                  <div className="text-[10px] font-mono text-[#9FB3D1]">
                    FLAGSHIP SYSTEM — PODZO
                  </div>
                  <span className="text-[10px] font-bold text-[#3DDC97] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC97] animate-pulse" />
                    LIVE BTP
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#050E22] mb-4">
                  <img
                    src="/media/podzo_live_production_screen.png"
                    alt="PODZO Live Production Console"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Logistics Execution Control Tower</h4>
                    <p className="text-xs text-[#9FB3D1]">Siding Dispatch & Touchless MIRO Verification</p>
                  </div>
                  <Link href="/solution/podzo/demo">
                    <Button size="sm" variant="primary" className="!px-3 !py-1.5 !text-xs">
                      <span>Launch</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-h2 font-bold text-white">
              Enterprise Solutions Catalog
            </h2>
            <p className="text-sm text-[#9FB3D1] mt-1">
              Select any solution to explore 3-tier architecture, interactive 8-card walkthroughs, and live BTP systems.
            </p>
          </div>
          <Link
            href="/pillars"
            className="text-xs font-mono text-[#00B8F5] hover:underline inline-flex items-center gap-1"
          >
            <span>View 5 Pillars Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pillar Filter Pills */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-white/10 mb-8">
          <button
            onClick={() => {
              audio.play('ui_click');
              setSelectedPillar('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedPillar === 'all'
                ? 'bg-gradient-to-r from-[#0070F2] to-[#00B8F5] text-white shadow-lg shadow-[#0070F2]/30'
                : 'bg-[#102A5C]/40 text-[#9FB3D1] border border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ALL (28)</span>
          </button>

          {pillarsData.map((pil) => {
            const Icon = pillarIcons[pil.id] || Layers;
            const isSelected = selectedPillar === pil.id;
            const count = solutionsData.filter((s) => s.pillarId === pil.id).length;

            return (
              <button
                key={pil.id}
                onClick={() => {
                  audio.play('pillar_select');
                  setSelectedPillar(pil.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'text-white border'
                    : 'bg-[#102A5C]/40 text-[#9FB3D1] border border-white/10 hover:text-white hover:border-white/20'
                }`}
                style={{
                  borderColor: isSelected ? pil.accent : undefined,
                  backgroundColor: isSelected ? `${pil.accent}33` : undefined,
                  boxShadow: isSelected ? `0 0 16px ${pil.accent}44` : undefined,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pil.title}</span>
                <span className="ml-1 opacity-75 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((sol) => {
            const pillar = pillarsData.find((p) => p.id === sol.pillarId);
            return (
              <GlassPanel
                key={sol.slug}
                glowColor={sol.featured ? pillar?.accent : undefined}
                className="p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{ color: pillar?.accent || '#0070F2' }}
                    >
                      {pillar?.title}
                    </span>
                    {sol.featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0070F2]/20 text-[#00B8F5] border border-[#00B8F5]/30">
                        FEATURED
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {sol.title}
                  </h3>

                  <p className="text-xs text-[#9FB3D1] leading-relaxed mb-4 line-clamp-2">
                    {sol.oneLiner}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {sol.tags.map((t) => (
                      <Chip key={t} label={t} variant="neutral" />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-[#9FB3D1] uppercase">
                      ROI Impact
                    </span>
                    <span className="text-xs font-bold text-[#3DDC97]">
                      {sol.roiMetric}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/solution/${sol.slug}/demo`}>
                      <Button size="sm" variant="primary" className="!py-1.5 !px-3 !text-xs">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Demo</span>
                      </Button>
                    </Link>
                    <Link href={`/solution/${sol.slug}`}>
                      <Button size="sm" variant="glass" className="!py-1.5 !px-3 !text-xs">
                        <span>Details</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </section>
    </div>
  );
}
