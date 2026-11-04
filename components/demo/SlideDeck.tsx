'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppContentSchema } from '@/lib/schema';
import { z } from 'zod';
import { BotSprite } from '@/components/BotSprite';
import { PoseName } from '@/lib/poses';
import { ContactDialog } from '@/components/ContactDialog';
import { useTypewriter } from '@/lib/useTypewriter';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

// Card Type Subcomponents
import { HookCard } from './CardTypes/HookCard';
import { ChallengeCard } from './CardTypes/ChallengeCard';
import { SolutionCard } from './CardTypes/SolutionCard';
import { LiveUiCard } from './CardTypes/LiveUiCard';
import { WorkflowCard } from './CardTypes/WorkflowCard';
import { TechStackCard } from './CardTypes/TechStackCard';
import { ImpactCard } from './CardTypes/ImpactCard';
import { CtaCard } from './CardTypes/CtaCard';

type AppData = z.infer<typeof AppContentSchema>;

export interface SlideDeckProps {
  appData: AppData;
  slug: string;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ appData, slug }) => {
  // Slide index 0..7 = cards 1..8; slide index 8 = Slide 9 (Closing)
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const totalCards = 8;
  const isClosing = slideIndex >= totalCards;
  const currentCard = isClosing ? null : appData.cards[slideIndex] || appData.cards[0];

  const currentDialogue = currentCard?.botDialogue || '';
  const currentPose: PoseName = (currentCard?.botPose as PoseName) || (isClosing ? 'thanks' : 'explain');

  const { shown: typedDialogue, finish: finishTyping } = useTypewriter(currentDialogue, {
    speed: 24,
  });

  const goNext = useCallback(() => {
    if (slideIndex < totalCards) {
      setSlideIndex((prev) => prev + 1);
    }
  }, [slideIndex, totalCards]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  }, [slideIndex]);

  const restart = useCallback(() => {
    setSlideIndex(0);
  }, []);

  // Keyboard navigation: ArrowRight / Space advances, ArrowLeft goes back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input/textarea is focused or modal is open
      if (isContactOpen) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isContactOpen]);

  // Render active card content
  const renderCardContent = () => {
    if (isClosing) {
      return (
        <div className="py-6 sm:py-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E6F7ED] border border-[#A6E9BD] flex items-center justify-center mx-auto text-[var(--ok)] shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-50)] text-[var(--brand-600)] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clean Core Walkthrough Complete</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">
              Thank You for Exploring {appData.title.split('—')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed">
              {appData.closing?.liveDemoInfo ||
                'Live SAP BTP Cloud Foundry tenant accessible for authenticated enterprise reviewers. Single Sign-On enabled with automated role segregation.'}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Demo Contact</span>
            </button>

            {appData.closing?.feedbackUrl ? (
              <a
                href={appData.closing.feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <span>Share feedback</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-dim)]" />
              </a>
            ) : (
              <a
                href={`mailto:contact@abhiyantaindia.com?subject=${encodeURIComponent(
                  `[Feedback] ${appData.title}`
                )}`}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <span>Share feedback</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-dim)]" />
              </a>
            )}

            <button
              type="button"
              onClick={restart}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Walkthrough</span>
            </button>
          </div>
        </div>
      );
    }

    if (!currentCard) return null;

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
        return <CtaCard card={currentCard} slug={slug} />;
      default:
        return null;
    }
  };

  const progressPercent = isClosing ? 100 : Math.round(((slideIndex + 1) / totalCards) * 100);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[var(--bg)] text-[var(--text)] px-4 sm:px-6 py-6 sm:py-8 max-w-[1040px] mx-auto flex flex-col justify-between">
      {/* 1. Header Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <Link
            href={`/solution/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--brand)] transition-colors truncate max-w-[260px] sm:max-w-md"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">{appData.title}</span>
          </Link>

          {/* Slide Indicator */}
          <div className="shrink-0 text-xs font-semibold text-[var(--navy)]">
            {isClosing ? 'Closing Slide' : `Slide ${slideIndex + 1} / ${totalCards}`}
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
          <div
            className="h-full bg-[var(--brand)] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Main 16:9 Stage Card (Max 1040px wide, white surface, 1px border) */}
      <div className="card w-full p-6 sm:p-10 min-h-[420px] sm:min-h-[480px] flex flex-col justify-between relative bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] mb-6">
        {/* Card Title Header */}
        {!isClosing && currentCard && (
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border)]">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--brand)] block mb-0.5">
                {currentCard.type.toUpperCase()}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--navy)] leading-tight">
                {currentCard.title}
              </h3>
            </div>
            <span className="chip">
              Clean Core
            </span>
          </div>
        )}

        {/* Card Content Shell */}
        <div className="flex-1 flex flex-col justify-center">{renderCardContent()}</div>

        {/* Footer Navigation Controls */}
        <div className="mt-8 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={slideIndex === 0}
            className={`btn btn-secondary inline-flex items-center gap-1.5 text-xs ${
              slideIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Quick Dots Jump Indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {Array.from({ length: totalCards }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlideIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  slideIndex === i
                    ? 'w-6 bg-[var(--brand)]'
                    : slideIndex > i
                    ? 'w-2 bg-[var(--navy)] opacity-40 hover:opacity-80'
                    : 'w-2 bg-[var(--border)] hover:bg-[var(--text-dim)]'
                }`}
                title={`Jump to Slide ${i + 1}`}
                aria-label={`Jump to Slide ${i + 1}`}
              />
            ))}
            {/* Closing dot */}
            <button
              type="button"
              onClick={() => setSlideIndex(totalCards)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                isClosing
                  ? 'w-6 bg-[var(--ok)]'
                  : 'w-2 bg-[var(--border)] hover:bg-[var(--text-dim)]'
              }`}
              title="Jump to Closing Slide"
              aria-label="Jump to Closing Slide"
            />
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={isClosing}
            className={`btn btn-primary inline-flex items-center gap-1.5 text-xs ${
              isClosing ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span>{slideIndex === totalCards - 1 ? 'Finish & Summary' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Bot Strip Below Stage (140px bot sprite + typewriter speech bubble) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] flex items-center gap-4 sm:gap-6">
        <div className="shrink-0 flex flex-col items-center">
          <BotSprite
            pose={currentPose}
            width={120}
            height={120}
            alt="Lead Architect Walkthrough Guide"
          />
          <div className="w-20 h-2 bg-black/10 rounded-full blur-[1px] mt-[-4px]" />
        </div>

        <div
          className="flex-1 cursor-pointer select-none"
          onClick={finishTyping}
          title="Click to reveal full text"
        >
          <div className="text-xs font-bold text-[var(--brand)] mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Lead Architect</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed min-h-[40px]">
            {isClosing
              ? 'Thank you for reviewing our enterprise solution architecture! Reach out to schedule an executive demonstration or test-drive live in our SAP BTP tenant.'
              : typedDialogue || currentDialogue}
          </p>
        </div>
      </div>

      {/* Contact Dialog Modal */}
      <ContactDialog
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        contact={appData.contact}
        solutionTitle={appData.title}
      />
    </div>
  );
};
