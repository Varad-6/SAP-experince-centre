'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ShieldCheck, Mail, Play, Sparkles } from 'lucide-react';
import { BotSprite } from '@/components/BotSprite';
import { ContactDialog } from '@/components/ContactDialog';

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
    contact?: {
      name: string;
      role: string;
      email: string;
      phone?: string;
      teamsUrl?: string;
    };
  } | null;
}

export const SolutionDetailClient: React.FC<SolutionDetailProps> = ({
  solution,
  pillar,
  appData,
}) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const introText = appData?.intro || appData?.heroHeadline || solution.oneLiner;
  const teaserText = appData?.basicIntro || solution.oneLiner;

  const thumbnailPath =
    solution.slug === 'sap-btp-vibe-coding'
      ? '/assets/apps/sap-btp-vibe-coding/01_Entitlements_Entity_Assignments.png'
      : `/assets/apps/${solution.slug}/screen-1.png`;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[var(--bg)] text-[var(--text)] px-6 sm:px-8 py-8 sm:py-12 max-w-[1200px] mx-auto">
      {/* 1. Breadcrumb: Pillars > [Pillar Title] > [Solution Title] */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-dim)] mb-6 flex-wrap">
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

      {/* 2. Title Block */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7ED] text-[var(--ok)]">
            <ShieldCheck className="w-3.5 h-3.5" /> Clean Core Certified
          </span>
          <span className="chip">
            {solution.roiMetric}
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

        <p className="text-base sm:text-lg text-[var(--text-dim)] max-w-3xl leading-relaxed">
          {introText}
        </p>
      </div>

      {/* 3. Center: Large 16:9 .card with solution visual */}
      <div className="card overflow-hidden mb-10 border border-[var(--border)] shadow-[var(--shadow)] bg-[var(--surface)]">
        <div className="relative aspect-video w-full bg-[var(--surface-2)] flex items-center justify-center overflow-hidden">
          <img
            src={thumbnailPath}
            alt={solution.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/bot/_placeholder.svg';
            }}
          />
        </div>
      </div>

      {/* 4. Bottom Action Row + Docked Bot in Present Pose */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="btn btn-secondary flex-1 sm:flex-initial inline-flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Contact for details</span>
          </button>

          <Link
            href={`/solution/${solution.slug}/demo`}
            className="flex-1 sm:flex-initial"
          >
            <button className="btn btn-primary w-full inline-flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>Demo</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </Link>
        </div>

        {/* Right: Bot Docked in 'present' pose with 1-sentence teaser */}
        <div className="flex items-center gap-3 max-w-md w-full md:w-auto">
          <div className="relative p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] flex-1">
            <div className="text-[11px] font-bold text-[var(--brand)] mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Lead Architect</span>
            </div>
            <p className="leading-relaxed line-clamp-2">{teaserText}</p>
            {/* Bubble Tail pointing right */}
            <div className="hidden md:block absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[var(--surface-2)] border-t border-r border-[var(--border)] rotate-45" />
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <BotSprite pose="present" width={90} height={90} alt="Lead Architect Presenting" />
            <div className="w-16 h-2 bg-black/10 rounded-full blur-[1px] mt-[-2px]" />
          </div>
        </div>
      </div>

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
