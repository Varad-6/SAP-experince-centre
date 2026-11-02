import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, Play, ShieldCheck } from 'lucide-react';

export function generateStaticParams() {
  return pillarsData.map((p) => ({ id: p.id }));
}

export default async function PillarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pillar = pillarsData.find((p) => p.id === id);

  if (!pillar) {
    notFound();
  }

  const solutions = solutionsData.filter((s) => s.pillarId === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Pillar Header */}
      <div className="mb-10 pb-8 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link
            href="/pillars"
            className="text-xs font-mono text-[#9FB3D1] hover:text-[#00B8F5] transition-colors"
          >
            ← ALL 5 PILLARS
          </Link>
          <span className="text-white/20">•</span>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border"
            style={{
              color: pillar.accent,
              borderColor: `${pillar.accent}40`,
              backgroundColor: `${pillar.accent}15`,
            }}
          >
            PILLAR {pillar.order}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#3DDC97]">
            <ShieldCheck className="w-3.5 h-3.5" /> Clean Core
          </span>
        </div>

        <h1 className="text-h1 font-bold text-white mb-3">{pillar.title}</h1>
        <p className="text-body text-[#9FB3D1] max-w-3xl leading-relaxed">
          {pillar.tagline}
        </p>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((sol) => (
          <GlassPanel
            key={sol.slug}
            glowColor={sol.featured ? pillar.accent : undefined}
            className="p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-white group-hover:text-[#00B8F5] transition-colors">
                  {sol.title}
                </h3>
                {sol.featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0070F2]/20 text-[#00B8F5] border border-[#00B8F5]/40 shrink-0">
                    FEATURED
                  </span>
                )}
              </div>

              <p className="text-xs text-[#9FB3D1] leading-relaxed mb-4">
                {sol.oneLiner}
              </p>

              {/* Tags */}
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
                  <Button size="sm" variant="primary" className="!py-1.5 !px-3 !text-xs gap-1.5">
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
        ))}
      </div>
    </div>
  );
}
