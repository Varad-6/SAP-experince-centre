'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import siteData from '@/content/site.json';
import { LandingActorSequence } from '@/components/LandingActorSequence';
import { ContactDialog } from '@/components/ContactDialog';
import { ArrowRight, ShieldCheck, Sparkles, Mail } from 'lucide-react';

export default function LandingPage() {
  const [introDone, setIntroDone] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="relative w-full min-h-[calc(100vh-56px)] overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[var(--sky-top)] to-[var(--sky-bottom)]">
      {/* Drifting Clouds */}
      <div className="cloud cloud-1" aria-hidden="true" />
      <div className="cloud cloud-2" aria-hidden="true" />

      {/* 3-Act Video Intro Layer */}
      <LandingActorSequence onSequenceComplete={() => setIntroDone(true)} />

      {/* Top Floating Baseline Bar (Moved Upside) */}
      <div className="relative z-40 max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--surface)]/90 border border-[var(--border)] text-xs font-semibold text-[var(--ok)] shadow-xs">
            <ShieldCheck size={14} />
            <span>Clean Core Certified • SAP BTP Architecture</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface)]/90 border border-[var(--border)] text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--brand)] transition-colors shadow-xs cursor-pointer"
          >
            <Mail size={13} />
            <span>Contact Architecture Team</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-8 sm:pt-14 pb-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-auto">
        {/* Left Title Block */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--brand-vivid)] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-vivid)]" />
              <span className="tracking-wider uppercase font-bold text-[11px]">Abhiyanta India Solutions</span>
            </div>

            <h1 className="text-[var(--navy)] font-black text-[clamp(2.75rem,5.5vw,5rem)] tracking-tight leading-[1.05]">
              Aayam
              <span className="block text-[var(--brand-vivid)] text-[clamp(1.25rem,2.4vw,2.25rem)] font-bold tracking-tight mt-1">
                AIS Experience Centre
              </span>
            </h1>

            <p className="text-[var(--brand-600)] font-semibold text-sm sm:text-base tracking-wide uppercase">
              Exploring new dimensions of technology
            </p>
          </div>

          <p className="text-[var(--text-dim)] text-base sm:text-lg max-w-xl leading-relaxed">
            {siteData.sub ||
              'Explore production solutions built across SAP BTP, Clean Core extensibility, and modern enterprise intelligence with analytics.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="/pillars">
              <button className="btn btn-primary h-12 px-8 text-base inline-flex items-center gap-2.5 shadow-md hover:scale-[1.02] transition-transform">
                <Sparkles className="w-4 h-4" />
                <span>Explore solutions</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Stage Spacer (LandingActorSequence sits here) */}
        <div className="hidden lg:block lg:col-span-5 min-h-[420px]" aria-hidden="true" />
      </div>

      {/* Clean Subtle Footer */}
      <div className="relative w-full py-3 border-t border-[var(--border)]/60 bg-[var(--surface)]/30 z-10 flex items-center justify-between px-6 sm:px-8 text-[11px] text-[var(--text-dim)]">
        <div>Enterprise Horizon • AIS Experience Centre</div>
        <div className="text-[var(--text-dim)] font-mono">Clean Core Standard</div>
      </div>

      {/* Contact Dialog */}
      <ContactDialog
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        solutionTitle="AIS Experience Centre Enterprise Review"
      />
    </div>
  );
}
