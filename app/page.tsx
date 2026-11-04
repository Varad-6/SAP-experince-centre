'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import siteData from '@/content/site.json';
import { BotSprite } from '@/components/BotSprite';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [bubbleText, setBubbleText] = useState<string>('');
  const [lineIndex, setLineIndex] = useState<number>(0);

  const introLines = siteData.introLines || [
    'Welcome to Abhiyanta India Solutions.',
    "I'm your Lead Architect bot.",
    'Explore 28 production SAP & AI solutions across 5 pillars.',
  ];

  // Rotate through speech bubble intro lines smoothly
  useEffect(() => {
    let currentText = '';
    const targetLine = introLines[lineIndex] || introLines[0];
    let charIdx = 0;

    const timer = setInterval(() => {
      if (charIdx < targetLine.length) {
        currentText += targetLine[charIdx];
        setBubbleText(currentText);
        charIdx++;
      } else {
        clearInterval(timer);
        const switchTimeout = setTimeout(() => {
          setLineIndex((prev) => (prev + 1) % introLines.length);
        }, 3200);
        return () => clearTimeout(switchTimeout);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [lineIndex, introLines]);

  return (
    <div className="relative w-full min-h-[calc(100vh-56px)] overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[var(--sky-top)] to-[var(--sky-bottom)]">
      {/* Drifting Clouds */}
      <div className="cloud cloud-1" aria-hidden="true" />
      <div className="cloud cloud-2" aria-hidden="true" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
              <button className="btn btn-primary h-12 px-7 text-base inline-flex items-center gap-2.5 shadow-md">
                <span>Explore solutions</span>
                <ArrowRight className="w-4 h-4" />
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

        {/* Right Bot Stage */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-end min-h-[280px] sm:min-h-[360px]">
          {/* Speech Bubble */}
          <div className="relative mb-4 w-full max-w-[340px] p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] text-sm text-[var(--text)] transition-all">
            <div className="text-xs font-bold text-[var(--brand)] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{siteData.botName || 'The Lead Architect'}</span>
            </div>
            <p className="leading-snug min-h-[42px]">{bubbleText}</p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--surface)] border-b border-r border-[var(--border)] rotate-45" />
          </div>

          {/* Bot Sprite with Ground Shadow */}
          <div className="relative flex flex-col items-center">
            <BotSprite pose="wave" width={180} height={180} alt="Lead Architect Bot" />
            <div className="w-28 h-3.5 bg-black/10 rounded-full blur-[2px] mt-[-8px]" />
          </div>
        </div>
      </div>

      {/* Ground Strip (14% height, #E3E9F2) */}
      <div className="relative w-full h-24 sm:h-28 bg-[#E3E9F2] border-t border-[var(--border)] z-0 flex items-center justify-between px-6 sm:px-8 text-xs text-[var(--text-dim)]">
        <div>Clean Core Compliant • SAP BTP Architecture</div>
        <div>Abhiyanta Experience Centre</div>
      </div>
    </div>
  );
}
