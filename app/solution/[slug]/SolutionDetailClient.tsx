'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight, ShieldCheck, Mail, Play, Network } from 'lucide-react';
import { BotSprite } from '@/components/BotSprite';
import { BotBubble } from '@/components/BotBubble';
import { ContactDialog } from '@/components/ContactDialog';
import { ArchitectureDialog } from '@/components/ArchitectureDialog';
import type { ArchitectureData } from '@/lib/schema';

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
  appData?: {
    heroHeadline?: string;
    intro?: string;
    basicIntro?: string;
    sapComponents?: string[];
    cards?: Array<{
      imageUrl?: string;
      screenshot?: string;
    }>;
    contact?: {
      name: string;
      role: string;
      email: string;
      phone?: string;
      teamsUrl?: string;
    };
    architecture?: ArchitectureData;
  } | null;
}

export const SolutionDetailClient: React.FC<SolutionDetailProps> = ({
  solution,
  pillar,
  appData,
}) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [botPose, setBotPose] = useState<'present' | 'beckon'>('present');

  const introText = appData?.intro || appData?.heroHeadline || solution.oneLiner;
  const teaserText = appData?.basicIntro || solution.oneLiner;

  const thumbnailPath =
    appData?.cards?.[0]?.imageUrl ||
    `/assets/apps/${solution.slug}/c1_1.webp`;

  const openArchitecture = () => {
    setIsArchOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-transparent text-[var(--text)] px-6 sm:px-8 py-8 sm:py-12 max-w-[1200px] mx-auto pb-24">
      {/* 1. Navigation Row: Prominent Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={pillar ? `/pillar/${pillar.id}` : '/pillars'}
            prefetch={true}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--navy)] transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {pillar ? pillar.title : 'All Pillars'}</span>
          </Link>
        </div>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-dim)] flex-wrap">
          <Link href="/pillars" className="hover:text-[var(--brand)] transition-colors">
            Pillars
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--text-dim)]" />
          {pillar ? (
            <Link href={`/pillar/${pillar.id}`} className="hover:text-[var(--brand)] transition-colors">
              {pillar.title}
            </Link>
          ) : (
            <span>Pillar</span>
          )}
          <ChevronRight className="w-3 h-3 text-[var(--text-dim)]" />
          <span className="font-semibold text-[var(--navy)] truncate max-w-[280px] sm:max-w-md">
            {solution.title}
          </span>
        </nav>
      </div>

      {/* 2. Title Block + Two Top Buttons */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7ED] text-[var(--ok)]">
              <ShieldCheck className="w-3.5 h-3.5" /> Clean Core Certified
            </span>
            {solution.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--text-dim)] border border-[var(--border)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-h1 font-bold text-[var(--navy)] tracking-tight mb-3">
            {solution.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-dim)] leading-relaxed">
            {introText}
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Link
              href={`/solution/${solution.slug}/demo`}
              prefetch={true}
              onMouseEnter={() => setBotPose('beckon')}
              onMouseLeave={() => setBotPose('present')}
              className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Interactive demo</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            {appData?.architecture && (
              <button
                type="button"
                onClick={openArchitecture}
                className="btn btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Network className="w-4 h-4" />
                <span>Architecture</span>
              </button>
            )}
          </div>

          {/* Contact Details Button underneath */}
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="btn btn-secondary w-full sm:w-auto bg-white border border-[var(--border)] text-[var(--brand)] hover:bg-slate-50 font-semibold inline-flex items-center justify-center gap-2 shadow-2xs"
          >
            <Mail className="w-4 h-4 text-[var(--brand)]" />
            <span>Contact details</span>
          </button>
        </div>
      </div>

      {/* 3. Center: Clean 16:9 .card with solution visual */}
      <div
        id="solution-visual-card"
        className="card overflow-hidden mb-10 border border-[var(--border)] shadow-[var(--shadow)] bg-[var(--surface)]"
      >
        <div className="relative w-full max-h-[520px] bg-[var(--surface-2)] flex items-center justify-center overflow-hidden p-2">
          <img
            src={thumbnailPath}
            alt={solution.title}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg"
          />
        </div>
      </div>

      {/* 5. Persistent Floating Aayam Companion Dock (Fixed to bottom right of viewport) */}
      <div className="fixed bottom-4 right-6 z-40 pointer-events-auto flex items-end gap-3 select-none">
        <BotBubble
          text={teaserText}
          placement="left"
          durationMs={12000}
          showTail={true}
        />

        <div
          className="flex flex-col items-center shrink-0 cursor-pointer group"
          onClick={() => setBotPose((prev) => (prev === 'present' ? 'beckon' : 'present'))}
          title="Lead Architect Aayam"
        >
          <BotSprite
            pose={botPose}
            heightPx={135}
            alt={`Lead Architect Bot ${botPose}`}
          />
          <div className="w-16 h-2 bg-black/10 rounded-full blur-[1px] mt-[-2px] group-hover:bg-black/20 transition-colors" />
        </div>
      </div>

      {/* Architecture Blueprint Modal */}
      <ArchitectureDialog
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
        solutionTitle={solution.title}
        architecture={appData?.architecture}
      />

      {/* Contact Dialog Modal */}
      <ContactDialog
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        contact={appData?.contact}
        solutionTitle={solution.title}
      />
    </div>
  );
};
