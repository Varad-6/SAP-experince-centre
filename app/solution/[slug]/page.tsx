import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import solutionsData from '@/content/solutions.json';
import pillarsData from '@/content/pillars.json';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Play, CheckCircle2, ArrowLeft, ShieldCheck, Cpu, Database } from 'lucide-react';

export function generateStaticParams() {
  return solutionsData.map((s) => ({ slug: s.slug }));
}

export default async function SolutionOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = solutionsData.find((s) => s.slug === slug);

  if (!solution) {
    notFound();
  }

  const pillar = pillarsData.find((p) => p.id === solution.pillarId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/pillar/${solution.pillarId}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9FB3D1] hover:text-[#00B8F5] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO {pillar?.title.toUpperCase()}</span>
        </Link>
        <span className="text-white/20">•</span>
        <span className="text-xs font-mono text-[#00B8F5]">{solution.slug.toUpperCase()}</span>
      </div>

      {/* Hero Header Glass Card */}
      <GlassPanel glowColor={pillar?.accent} className="p-8 sm:p-12 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
            style={{
              color: pillar?.accent,
              borderColor: `${pillar?.accent}40`,
              backgroundColor: `${pillar?.accent}15`,
            }}
          >
            {pillar?.title}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-[#3DDC97] bg-[#3DDC97]/10 border border-[#3DDC97]/25">
            <ShieldCheck className="w-3.5 h-3.5" /> Clean Core Certified
          </span>
        </div>

        <h1 className="text-h1 font-bold text-white mb-4 leading-tight">
          {solution.title}
        </h1>

        <p className="text-body text-[#9FB3D1] max-w-3xl leading-relaxed mb-8">
          {solution.oneLiner}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-4">
          <Link href={`/solution/${solution.slug}/demo`}>
            <Button size="lg" variant="primary" glow className="gap-2.5">
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Launch Interactive 3D Demo</span>
            </Button>
          </Link>
          <Link href="/prerequisites">
            <Button size="lg" variant="glass">
              <span>View Landscape Prerequisites</span>
            </Button>
          </Link>
          <Link href="/architecture">
            <Button size="lg" variant="glass">
              <span>Inspect 3-Tier Topology</span>
            </Button>
          </Link>
        </div>
      </GlassPanel>

      {/* Key Architectural Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassPanel subtle className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#0070F2]/15 text-[#00B8F5]">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-[#9FB3D1] uppercase">Primary ROI</span>
          </div>
          <p className="text-2xl font-bold text-[#3DDC97]">{solution.roiMetric}</p>
        </GlassPanel>

        <GlassPanel subtle className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#00B8F5]/15 text-[#00B8F5]">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-[#9FB3D1] uppercase">Extensibility</span>
          </div>
          <p className="text-xl font-bold text-white">Side-by-Side BTP</p>
        </GlassPanel>

        <GlassPanel subtle className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-[#9FB3D1] uppercase">ERP Core Mod</span>
          </div>
          <p className="text-xl font-bold text-white">0 Modifications</p>
        </GlassPanel>
      </div>

      {/* Solution Tags */}
      <GlassPanel subtle className="p-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-[#9FB3D1] mr-2">Core Competencies:</span>
        {solution.tags.map((tag) => (
          <Chip key={tag} label={tag} variant="neutral" />
        ))}
      </GlassPanel>
    </div>
  );
}
