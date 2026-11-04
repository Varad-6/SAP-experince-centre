'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import siteData from '@/content/site.json';
import { LandingActorSequence } from '@/components/LandingActorSequence';
import { SoundToggle } from '@/components/SoundToggle';
import { ContactDialog } from '@/components/ContactDialog';
import { sound } from '@/lib/sound';
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
      <div className="relative z-30 max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)]/90 backdrop-blur border border-[var(--border)] text-xs font-semibold text-[var(--ok)] shadow-xs">
            <ShieldCheck size={14} />
            <span>Clean Core Certified • SAP BTP Architecture</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setIsContactOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)]/90 backdrop-blur border border-[var(--border)] text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--brand)] transition-colors shadow-xs"
          >
            <Mail size={13} />
            <span className="hidden sm:inline">Contact Architecture Team</span>
          </button>
          <SoundToggle />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-8 sm:pt-14 pb-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-auto">
        {/* Left Title Block */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--brand)] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[var(--brand)]" />
            <span>ABHIYANTA INDIA SOLUTIONS</span>
          </div>

          <h1 className="text-[var(--navy)] font-bold text-display tracking-tight">
            {siteData.tagline || 'Next-Gen SAP Enterprise Solutions'}
          </h1>

          <p className="text-[var(--text-dim)] text-base sm:text-lg max-w-xl leading-relaxed">
            {siteData.sub ||
              'Explore 28 production solutions built across SAP BTP, Clean Core extensibility, and Agentic AI.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="/pillars" onClick={() => sound.click()}>
              <button className="btn btn-primary h-12 px-7 text-base inline-flex items-center gap-2.5 shadow-md hover:scale-[1.02] transition-transform">
                <Sparkles className="w-4 h-4" />
                <span>Explore solutions</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </Link>

            <Link href="/solution/podzo" onClick={() => sound.click()}>
              <button className="btn btn-secondary h-12 px-6 text-base inline-flex items-center gap-2">
                <span>View Flagship (PODZO)</span>
              </button>
            </Link>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-6 border-t border-[var(--border)] grid grid-cols-3 gap-4 max-w-lg">
            {siteData.stats.slice(0, 3).map((st, i) => (
              <div key={i}>
                <div className="text-xl sm:text-2xl font-bold text-[var(--navy)]">{st.value}</div>
                <div className="text-xs text-[var(--text-dim)] font-medium">{st.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Stage Spacer (LandingActorSequence sits here) */}
        <div className="hidden lg:block lg:col-span-5 min-h-[420px]" aria-hidden="true" />
      </div>

      {/* Clean Subtle Footer */}
      <div className="relative w-full py-3 border-t border-[var(--border)]/60 bg-[var(--surface)]/30 backdrop-blur-xs z-10 flex items-center justify-between px-6 sm:px-8 text-[11px] text-[var(--text-dim)]">
        <div>Enterprise Horizon • AIS Experience Centre</div>
        <div>Continuous Clean Core Delivery</div>
      </div>

      {/* Contact Dialog Modal */}
      <ContactDialog
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        contact={siteData.defaultContact}
        solutionTitle="Abhiyanta Experience Centre"
      />
    </div>
  );
}
