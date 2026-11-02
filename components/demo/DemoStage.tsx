'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { AppContentSchema } from '@/lib/schema';
import { z } from 'zod';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from './ProgressDots';
import { ArrowLeft, ArrowRight, Bot, ShieldCheck, X } from 'lucide-react';
import { HookCard } from './CardTypes/HookCard';
import { ChallengeCard } from './CardTypes/ChallengeCard';
import { SolutionCard } from './CardTypes/SolutionCard';
import { LiveUiCard } from './CardTypes/LiveUiCard';
import { WorkflowCard } from './CardTypes/WorkflowCard';
import { TechStackCard } from './CardTypes/TechStackCard';
import { ImpactCard } from './CardTypes/ImpactCard';
import { CtaCard } from './CardTypes/CtaCard';
import { CaptionBar } from '@/components/hud/CaptionBar';

type AppData = z.infer<typeof AppContentSchema>;

export const DemoStage: React.FC<{ appData: AppData }> = ({ appData }) => {
  const {
    scene,
    cardIndex,
    nextCard,
    prevCard,
    setScene,
    setBotState,
  } = useStore();

  useEffect(() => {
    setScene('DEMO');
    setBotState('explain');
  }, [setScene, setBotState]);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/solution/${appData.slug}`}
            className="p-2 rounded-xl bg-[#102A5C]/40 border border-white/10 text-[#9FB3D1] hover:text-white transition-colors"
            title="Exit Demo Stage"
          >
            <X className="w-4 h-4" />
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#00B8F5] uppercase">
              {appData.title.split('—')[0]?.trim()}
            </span>
            <span className="text-xs font-bold text-white">
              Stage 0{cardIndex + 1} of 08: {currentCard.type.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono text-[#3DDC97] bg-[#3DDC97]/10 border border-[#3DDC97]/20">
            <ShieldCheck className="w-3 h-3" /> Clean Core
          </span>
        </div>
      </div>

      {/* Main Glass Interactive Card Shell */}
      <GlassPanel glowColor="#0070F2" className="p-6 sm:p-8 relative min-h-[440px] flex flex-col justify-between shadow-2xl">
        <div>
          {/* Card Title */}
          <div className="mb-6 pb-4 border-b border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {currentCard.title}
            </h2>
          </div>

          {/* Dynamic Card Content Component */}
          <div className="mb-6">{renderCardContent()}</div>
        </div>

        {/* Card Footer: Progress Dots & Navigation */}
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
              <span>Previous</span>
            </Button>
          </div>

          <div className="order-1 sm:order-2">
            <ProgressDots current={cardIndex} total={8} />
          </div>

          <div className="flex items-center gap-2 order-3">
            <Button
              size="sm"
              variant="primary"
              glow
              onClick={() => nextCard(8)}
              className="gap-1.5"
            >
              <span>{cardIndex === 7 ? 'Restart Tour' : 'Next Stage'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </GlassPanel>

      {/* Spoken Bot Dialogue in Bottom Caption Bar */}
      <CaptionBar dialogue={currentCard.botDialogue} />
    </div>
  );
};
