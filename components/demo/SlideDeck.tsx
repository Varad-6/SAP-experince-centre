'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppContentSchema } from '@/lib/schema';
import { z } from 'zod';
import { BotSprite } from '@/components/BotSprite';
import { BotBubble } from '@/components/BotBubble';
import { ActivePoseName, resolvePose } from '@/lib/poses';
import { ContactDialog } from '@/components/ContactDialog';
import { SoundToggle } from '@/components/SoundToggle';
import { sound } from '@/lib/sound';
import {
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

  const currentDialogue = isClosing
    ? 'Thank you for reviewing our enterprise solution architecture! Reach out to schedule an executive demonstration or test-drive live in our SAP BTP tenant.'
    : currentCard?.botDialogue || '';

  const DEFAULT_CARD_POSES: ActivePoseName[] = [
    'present', // Card 1: Hook
    'point',   // Card 2: Challenge
    'tablet',  // Card 3: Solution DAG
    'point',   // Card 4: Live UI
    'tablet',  // Card 5: Workflow
    'laptop',  // Card 6: Tech Stack
    'present', // Card 7: Impact
    'beckon',  // Card 8: CTA
  ];

  const currentPose: ActivePoseName = resolvePose(
    isClosing ? 'thanks' : currentCard?.botPose || DEFAULT_CARD_POSES[slideIndex] || 'present'
  );

  const goNext = useCallback(() => {
    if (slideIndex < totalCards) {
      sound.slideNext();
      const nextIdx = slideIndex + 1;
      setSlideIndex(nextIdx);
      if (nextIdx >= totalCards) {
        sound.celebrate();
      }
    }
  }, [slideIndex, totalCards]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      sound.slidePrev();
      setSlideIndex((prev) => prev - 1);
    }
  }, [slideIndex]);

  const goToSlide = (idx: number) => {
    sound.click();
    setSlideIndex(idx);
    if (idx >= totalCards) {
      sound.celebrate();
    }
  };

  const restart = useCallback(() => {
    sound.click();
    setSlideIndex(0);
  }, []);

  // Keyboard navigation: ArrowRight / Space advances, ArrowLeft goes back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        <div className="py-4 sm:py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E6F7ED] border border-[#A6E9BD] flex items-center justify-center mx-auto text-[var(--ok)] shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-50)] text-[var(--brand-600)] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clean Core Walkthrough Complete</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--navy)] tracking-tight">
              Thank You for Exploring {appData.title.split('—')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed">
              {appData.closing?.liveDemoInfo ||
                'Live SAP BTP Cloud Foundry tenant accessible for authenticated enterprise reviewers. Single Sign-On enabled with automated role segregation.'}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.click();
                setIsContactOpen(true);
              }}
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
                onClick={() => sound.click()}
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
                onClick={() => sound.click()}
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
              <span>Restart</span>
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
    <div className="h-[calc(100vh-56px)] bg-[var(--bg)] text-[var(--text)] px-4 sm:px-6 py-4 max-w-[1400px] mx-auto flex flex-col justify-between overflow-hidden">
      {/* 1. Top Header Bar */}
      <div className="shrink-0 mb-3">
        <div className="flex items-center justify-between gap-4 mb-2">
          <Link
            href={`/solution/${slug}`}
            onClick={() => sound.click()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--brand)] transition-colors truncate max-w-[260px] sm:max-w-md"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">{appData.title}</span>
          </Link>

          <div className="flex items-center gap-3">
            <SoundToggle />

            {/* Slide Indicator Badge */}
            <div className="shrink-0 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--navy)] shadow-xs">
              {isClosing ? 'Closing Summary' : `Slide ${slideIndex + 1} of ${totalCards}`}
            </div>
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

      {/* 2. Main Presentation Cockpit (2 Columns: Left Slide, Right Bot Presenter) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 items-stretch">
        {/* Left Column (8 cols): Slide Card with Integrated Navigation */}
        <div className="lg:col-span-8 flex flex-col justify-between card p-5 sm:p-6 bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden">
          {/* Card Title Header */}
          {!isClosing && currentCard && (
            <div className="shrink-0 flex items-center justify-between gap-4 mb-3 pb-2.5 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--brand)] block">
                  {currentCard.type.toUpperCase()}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[var(--navy)] leading-tight">
                  {currentCard.title}
                </h3>
              </div>
              <span className="chip">Clean Core</span>
            </div>
          )}

          {/* Dynamic Card Content (Scrollable internally if screen is very short) */}
          <div className="flex-1 flex flex-col justify-center overflow-y-auto pr-1 my-1">
            {renderCardContent()}
          </div>

          {/* Bottom Integrated Navigation Row */}
          <div className="shrink-0 flex items-center justify-between pt-3 border-t border-[var(--border)] mt-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={slideIndex === 0}
              className={`btn btn-secondary h-9 px-3.5 text-xs inline-flex items-center gap-1.5 ${
                slideIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Slide Navigation Dots / Pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: totalCards }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToSlide(i)}
                  aria-label={`Jump to slide ${i + 1}`}
                  className={`w-7 h-6 rounded-md text-[11px] font-bold font-mono transition-all ${
                    slideIndex === i
                      ? 'bg-[var(--brand)] text-white shadow-xs'
                      : 'bg-[var(--surface-2)] text-[var(--text-dim)] hover:bg-[var(--brand-50)] hover:text-[var(--brand)]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToSlide(totalCards)}
                aria-label="Jump to closing slide"
                className={`px-2 h-6 rounded-md text-[10px] font-bold transition-all ${
                  isClosing
                    ? 'bg-[var(--brand)] text-white shadow-xs'
                    : 'bg-[var(--surface-2)] text-[var(--text-dim)] hover:bg-[var(--brand-50)] hover:text-[var(--brand)]'
                }`}
              >
                End
              </button>
            </div>

            <button
              type="button"
              onClick={goNext}
              className="btn btn-primary h-9 px-4 text-xs inline-flex items-center gap-1.5"
            >
              <span>{slideIndex === totalCards - 1 ? 'Finish & Summary' : isClosing ? 'Done' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Aayam Presenter Column */}
        <div className="lg:col-span-4 flex flex-col justify-between items-center p-5 card bg-gradient-to-b from-[var(--surface)] to-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden">
          {/* Top: Thinking Speech Bubble */}
          <div className="w-full flex-1 flex flex-col justify-center items-center">
            <BotBubble
              text={currentDialogue}
              speakerName="Aayam"
              placement="top"
              showTail={true}
              className="w-full max-w-sm mb-2"
            />
          </div>

          {/* Bottom: Mascot Sprite Standing on Pedestal */}
          <div className="shrink-0 flex flex-col items-center justify-end relative">
            <BotSprite
              pose={currentPose}
              heightPx={280}
              alt="Aayam Explaining"
              priority={true}
            />
            {/* Soft Pedestal Shadow */}
            <div className="w-28 h-3 bg-black/10 rounded-full blur-[2px] mt-[-6px]" />
          </div>
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
