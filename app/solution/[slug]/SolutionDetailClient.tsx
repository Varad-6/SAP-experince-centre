'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { BookDemoModal } from '@/components/demo/BookDemoModal';
import {
  Play,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Cpu,
  Database,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface SolutionDetailProps {
  solution: {
    slug: string;
    pillarId: string;
    title: string;
    oneLiner: string;
    tags: string[];
    roiMetric: string;
    featured: boolean;
  };
  pillar?: {
    id: string;
    title: string;
    accent: string;
    tagline: string;
  };
}

export const SolutionDetailClient: React.FC<SolutionDetailProps> = ({
  solution,
  pillar,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/pillar/${solution.pillarId}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9FB3D1] hover:text-[#00B8F5] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO {pillar?.title.toUpperCase() || 'PILLAR'}</span>
        </Link>
        <span className="text-white/20">•</span>
        <span className="text-xs font-mono text-[#00B8F5]">
          {solution.slug.toUpperCase()}
        </span>
      </div>

      {/* Hero Header Card */}
      <GlassPanel glowColor={pillar?.accent} className="p-8 sm:p-12 mb-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
            style={{
              color: pillar?.accent || '#0070F2',
              borderColor: `${pillar?.accent || '#0070F2'}40`,
              backgroundColor: `${pillar?.accent || '#0070F2'}15`,
            }}
          >
            {pillar?.title}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-[#3DDC97] bg-[#3DDC97]/10 border border-[#3DDC97]/25">
            <ShieldCheck className="w-3.5 h-3.5" /> Clean Core Certified
          </span>
        </div>

        <h1 className="text-h1 font-bold text-white mb-4 leading-tight">
          {solution.title}
        </h1>

        <p className="text-body text-[#9FB3D1] max-w-3xl leading-relaxed mb-8">
          {solution.oneLiner}
        </p>

        {/* 2 Primary Action Buttons */}
        <div className="p-6 rounded-2xl bg-[#060D1D]/70 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Experience or Evaluate</h4>
            <p className="text-xs text-[#9FB3D1]">
              Launch the 8-slide interactive walkthrough or schedule an executive session with our sales desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Option 1: Demo Walkthrough */}
            <Link href={`/solution/${solution.slug}/demo`}>
              <Button size="lg" variant="primary" className="gap-2.5">
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Launch Interactive Demo</span>
              </Button>
            </Link>

            {/* Option 2: Book a Demo */}
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsModalOpen(true)}
              className="gap-2.5"
            >
              <Mail className="w-4 h-4 text-[#00B8F5]" />
              <span>Book a Demo</span>
            </Button>
          </div>
        </div>
      </GlassPanel>

      {/* Key Architectural Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassPanel subtle className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#0070F2]/15 text-[#00B8F5]">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-[#9FB3D1] uppercase">Primary ROI Impact</span>
          </div>
          <p className="text-2xl font-bold text-[#3DDC97]">{solution.roiMetric}</p>
        </GlassPanel>

        <GlassPanel subtle className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#00B8F5]/15 text-[#00B8F5]">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-[#9FB3D1] uppercase">Extensibility Runtime</span>
          </div>
          <p className="text-xl font-bold text-white">SAP BTP Cloud Foundry</p>
        </GlassPanel>

        <GlassPanel subtle className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-[#9FB3D1] uppercase">ERP Core Integrity</span>
          </div>
          <p className="text-xl font-bold text-white">Zero Modifications</p>
        </GlassPanel>
      </div>

      {/* Solution Tags & Quick Specs */}
      <GlassPanel subtle className="p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#9FB3D1] mr-2">Core Competencies:</span>
          {solution.tags.map((tag) => (
            <Chip key={tag} label={tag} variant="neutral" />
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#9FB3D1]">
          <Link href="/prerequisites" className="hover:text-white transition-colors">
            Prerequisites →
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/architecture" className="hover:text-white transition-colors">
            3-Tier Topology →
          </Link>
        </div>
      </GlassPanel>

      {/* Book a Demo Mail Dispatch Modal */}
      <BookDemoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        solutionTitle={solution.title}
        slug={solution.slug}
      />
    </div>
  );
};
