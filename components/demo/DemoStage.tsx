'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { AppContentSchema } from '@/lib/schema';
import { z } from 'zod';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from './ProgressDots';
import { ArrowLeft, ArrowRight, ShieldCheck, X, Sparkles } from 'lucide-react';
import { HookCard } from './CardTypes/HookCard';
import { ChallengeCard } from './CardTypes/ChallengeCard';
import { SolutionCard } from './CardTypes/SolutionCard';
import { LiveUiCard } from './CardTypes/LiveUiCard';
import { WorkflowCard } from './CardTypes/WorkflowCard';
import { TechStackCard } from './CardTypes/TechStackCard';
import { ImpactCard } from './CardTypes/ImpactCard';
import { CtaCard } from './CardTypes/CtaCard';

type AppData = z.infer<typeof AppContentSchema>;

export const DemoStage: React.FC<{ appData: AppData }> = ({ appData }) => {
  const {
    scene,
    cardIndex,
    nextCard,
    prevCard,
    setScene,
  } = useStore();

  useEffect(() => {
    setScene('DEMO');
  }, [setScene]);

  const currentCard = appData.cards[cardIndex] || appData.cards[0];

  const renderCardContent = () => {
    switch (currentCard.type) {
      case 'hook':
        return <HookCard card={currentCard} />;
      case 'challenge':
        return <ChallengeCard card={currentCard} />;
      case 'solution':
        return <SolutionCard card={currentCard} />;
      case 'live-ui':
        return <LiveUiCard card={currentCard} />;
      case 'workflow':
        return <WorkflowCard card={currentCard} />;
      case 'tech-stack':
        return <TechStackCard card={currentCard} />;
      case 'impact':
        return <ImpactCard card={currentCard} />;
      case 'cta':
        return <CtaCard card={currentCard} slug={appData.slug} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-40">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/solution/${appData.slug}`}
            className="p-2 rounded-xl bg-[#102A5C]/40 border border-white/10 text-[#9FB3D1] hover:text-white transition-colors"
            title="Exit Walkthrough"
          >
            <X className="w-4 h-4" />
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#00B8F5] uppercase tracking-wider font-bold">
              {appData.title.split('—')[0]?.trim()}
            </span>
            <span className="text-xs font-bold text-white">
              Slide 0{cardIndex + 1} of 08: {currentCard.type.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono text-[#3DDC97] bg-[#3DDC97]/10 border border-[#3DDC97]/25">
            <ShieldCheck className="w-3.5 h-3.5" /> Clean Core Compliant
          </span>
        </div>
      </div>

      {/* Main Slide Canvas (Clean executive presentation slide) */}
      <GlassPanel glowColor="#0070F2" className="p-6 sm:p-10 relative min-h-[460px] flex flex-col justify-between shadow-2xl border border-white/10">
        <div>
          {/* Slide Title */}
          <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {currentCard.title}
            </h2>
            <span className="text-xs font-mono text-[#9FB3D1] hidden sm:inline">
              Step {cardIndex + 1} of 8
            </span>
          </div>

          {/* Active Slide Body */}
          <div className="mb-6">{renderCardContent()}</div>
        </div>

        {/* Slide Controls & Progress Dots */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <Button
              size="sm"
              variant="glass"
              disabled={cardIndex === 0}
              onClick={prevCard}
              className="gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Slide</span>
            </Button>
          </div>

          <div className="order-1 sm:order-2">
            <ProgressDots current={cardIndex} total={8} />
          </div>

          <div className="flex items-center gap-2 order-3">
            <Button
              size="sm"
              variant="primary"
              onClick={() => nextCard(8)}
              className="gap-1.5 font-bold"
            >
              <span>{cardIndex === 7 ? 'Restart Walkthrough' : 'Next Slide'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};
