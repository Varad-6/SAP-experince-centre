'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import siteData from '@/content/site.json';
import { LandingActorSequence } from '@/components/LandingActorSequence';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="relative w-full min-h-[calc(100vh-56px)] overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[var(--sky-top)] to-[var(--sky-bottom)]">
      {/* Drifting Clouds */}
      <div className="cloud cloud-1" aria-hidden="true" />
      <div className="cloud cloud-2" aria-hidden="true" />

      {/* 3-Act Video Intro Layer */}
      <LandingActorSequence onSequenceComplete={() => setIntroDone(true)} />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-10 sm:pt-16 pb-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-auto">
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
            <Link href="/pillars">
              <button className="btn btn-primary h-12 px-7 text-base inline-flex items-center gap-2.5 shadow-md hover:scale-[1.02] transition-transform">
                <Sparkles className="w-4 h-4" />
                <span>Explore solutions</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </Link>

            <Link href="/solution/podzo">
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

        {/* Right Stage Spacer (LandingActorSequence video sits in this corner) */}
        <div className="hidden lg:block lg:col-span-5 min-h-[420px]" aria-hidden="true" />
      </div>

      {/* Ground Strip (14% height, #E3E9F2) */}
      <div className="relative w-full h-24 sm:h-28 bg-[#E3E9F2] border-t border-[var(--border)] z-0 flex items-center justify-between px-6 sm:px-8 text-xs text-[var(--text-dim)]">
        <div>Clean Core Compliant • SAP BTP Architecture</div>
        <div>Abhiyanta Experience Centre</div>
      </div>
    </div>
  );
}
