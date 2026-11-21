'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppContentSchema } from '@/lib/schema';
import { z } from 'zod';
import { BotSprite, HeadPosition } from '@/components/BotSprite';
import { BotBubble } from '@/components/BotBubble';
import { ActivePoseName, resolvePose } from '@/lib/poses';
import { getQuickPrompts, QuickPrompt } from '@/lib/quickPrompts';
import dynamic from 'next/dynamic';

const ContactDialog = dynamic(
  () => import('@/components/ContactDialog').then((m) => m.ContactDialog),
  { ssr: false }
);
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Maximize,
  Minimize,
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
  const router = useRouter();
  // Slide index 0..totalCards-1; slide index totalCards = Closing
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isGuideHidden, setIsGuideHidden] = useState<boolean>(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState<boolean>(true);
  const [bubbleKey, setBubbleKey] = useState<number>(0);

  useEffect(() => {
    setIsBubbleOpen(true);
    setBubbleKey((k) => k + 1);
  }, [slideIndex]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const totalCards = appData.cards?.length || 8;
  const isClosing = slideIndex >= totalCards;
  const currentCard = isClosing ? null : appData.cards[slideIndex] || appData.cards[0];
  const hasText = !isClosing && Boolean(currentCard?.description);

  const quickPrompts = useMemo(() => getQuickPrompts(slug), [slug]);
  const [selectedPrompt, setSelectedPrompt] = useState<QuickPrompt | null>(null);

  // Reset prompt override when moving between slides
  useEffect(() => {
    setSelectedPrompt(null);
  }, [slideIndex]);

  const handleSelectPrompt = useCallback((prompt: QuickPrompt) => {
    setSelectedPrompt(prompt);
    setIsBubbleOpen(true);
    setBubbleKey((k) => k + 1);
  }, []);

  const handleResetPrompt = useCallback(() => {
    setSelectedPrompt(null);
    setIsBubbleOpen(true);
    setBubbleKey((k) => k + 1);
  }, []);

  const currentDialogue = isClosing
    ? 'Thank you for reviewing our enterprise solution architecture! Reach out to schedule an executive demonstration or test-drive live in our SAP BTP tenant.'
    : selectedPrompt
      ? selectedPrompt.answer
      : !hasText
        ? ''
        : Array.isArray(currentCard?.botChat) && currentCard.botChat.length > 0
          ? currentCard.botChat.join(' ')
          : (currentCard?.botChat as unknown as string) || currentCard?.botDialogue || '';

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
    isClosing
      ? 'thanks'
      : selectedPrompt
        ? (selectedPrompt.pose || 'explain')
        : !hasText
          ? 'idle'
          : currentCard?.botPose || DEFAULT_CARD_POSES[slideIndex % DEFAULT_CARD_POSES.length] || 'present'
  );

  const [botHead, setBotHead] = useState<{ headX: number; hairTopY: number; headW: number } | undefined>(undefined);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = useState<number>(360);
  const [stageTop, setStageTop] = useState<number>(64);

  useEffect(() => {
    const updateStage = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        if (rect.height > 0) {
          setStageHeight(rect.height);
          setStageTop(rect.top);
        }
      }
    };
    updateStage();
    window.addEventListener('resize', updateStage);
    return () => window.removeEventListener('resize', updateStage);
  }, [slideIndex, hasText]);

  // Dynamically compute available bot height:
  // available = stageHeight - bubbleHeight - 52 - 8; botHeight = clamp(available, 150, 380)
  const bubbleEstimatedH = currentDialogue ? (currentDialogue.length > 80 ? 150 : 110) : 0;
  const hairClearance = 52;
  const safePad = 8;
  const available = stageHeight - bubbleEstimatedH - hairClearance - safePad;
  const botHeight = isMobile ? 125 : Math.max(150, Math.min(380, Math.round(available)));

  const handleHeadPosition = useCallback((pos: HeadPosition) => {
    setBotHead((prev) => {
      if (
        prev &&
        Math.abs(prev.headX - pos.headX) < 1 &&
        Math.abs(prev.hairTopY - pos.headY) < 1
      ) {
        return prev;
      }
      return { headX: pos.headX, hairTopY: pos.headY, headW: 160 };
    });
  }, []);

  const goNext = useCallback(() => {
    if (slideIndex < totalCards) {
      const nextIdx = slideIndex + 1;
      setSlideIndex(nextIdx);
    } else {
      router.push(`/solution/${slug}`);
    }
  }, [slideIndex, totalCards, router, slug]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  }, [slideIndex]);

  const goToSlide = (idx: number) => {
    setSlideIndex(idx);
  };

  const restart = useCallback(() => {
    setSlideIndex(0);
  }, []);

  // Keyboard navigation: ArrowRight / Space advances, ArrowLeft goes back, F toggles Fullscreen
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
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isContactOpen, toggleFullscreen]);

  // Render active card content
  const renderCardContent = () => {
    if (isClosing) {
      return (
        <div className="py-4 sm:py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E6F7ED] border border-[#A6E9BD] flex items-center justify-center mx-auto text-[var(--ok)] shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--brand-50)] text-[var(--brand-600)] text-xs font-semibold border border-[var(--brand-200,rgba(0,112,242,0.2))]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clean Core Walkthrough Complete</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--navy)] tracking-tight">
              Thank You for Exploring {appData.title.split(/[:\u2014]/)[0]}
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
              onClick={() => setIsContactOpen(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Sales Head</span>
            </button>

            <button
              type="button"
              onClick={restart}
              className="btn btn-secondary inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart deck</span>
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
    <div className="h-auto min-h-screen lg:h-[100dvh] lg:max-h-[100dvh] text-[var(--text)] flex flex-col justify-between transition-colors duration-300 bg-transparent p-2 sm:p-3 lg:p-4 max-w-[1440px] mx-auto overflow-y-auto lg:overflow-hidden">
      {/* 1. Top Header Bar */}
      <div className="shrink-0 mb-1.5 sm:mb-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2">
          <Link
            href={`/solution/${slug}`}
            prefetch={true}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--navy)] transition-colors shadow-xs truncate max-w-[180px] sm:max-w-md"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span>Back to Overview</span>
            <span className="text-[var(--text-dim)] font-normal hidden sm:inline">• {appData.title.split(/[:\u2014]/)[0]}</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* True Fullscreen Toggle Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen [F]' : 'Enter Executive Fullscreen [F]'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Executive Fullscreen'}
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                isFullscreen
                  ? 'bg-[var(--surface-2)] border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--surface)]'
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--navy)] hover:bg-[var(--surface-2)] hover:border-[var(--brand)]'
              }`}
            >
              {isFullscreen ? (
                <Minimize className="w-3.5 h-3.5" />
              ) : (
                <Maximize className="w-3.5 h-3.5 text-[var(--brand)]" />
              )}
              <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              <kbd className="hidden lg:inline px-1 py-0.2 rounded text-[10px] font-mono bg-black/10 dark:bg-white/10 opacity-70">
                F
              </kbd>
            </button>

            {/* Slide Indicator Badge */}
            <div className="shrink-0 px-2 sm:px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--navy)] shadow-xs">
              {isClosing ? 'Summary' : `Slide ${slideIndex + 1} of ${totalCards}`}
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

      {/* 2. Main Presentation Cockpit (2 Columns: Left Slide, Right Bot Presenter & Descriptions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 flex-1 min-h-0 h-full max-h-full items-stretch overflow-hidden">
        {/* Left Column (8 cols): Slide Card with Integrated Navigation */}
        <div className="lg:col-span-8 flex flex-col justify-between card p-3 sm:p-4 lg:p-5 bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden h-full min-h-0 max-h-full">
          {/* Card Title Header */}
          {!isClosing && currentCard && (
            <div className="shrink-0 flex items-start sm:items-center justify-between gap-3 mb-2 pb-2 border-b border-[var(--border)]">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--brand)] block">
                  {currentCard.type.toUpperCase()}
                </span>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[var(--navy)] leading-tight truncate">
                  {currentCard.title}
                </h3>
              </div>
              <div className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs font-semibold text-[var(--navy)] whitespace-nowrap shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--ok)] shrink-0" />
                <span>Clean Core</span>
              </div>
            </div>
          )}

          {/* Dynamic Card Content - Strictly constrained to fit slide box */}
          <div className="flex-1 min-h-0 h-full max-h-full overflow-hidden flex flex-col my-1">
            {renderCardContent()}
          </div>

          {/* Bottom Integrated Navigation Row with Horizontal Scroll */}
          <div className="shrink-0 flex items-center justify-between gap-1.5 sm:gap-2 pt-2.5 border-t border-[var(--border)] mt-1.5">
            <button
              type="button"
              onClick={goPrev}
              disabled={slideIndex === 0}
              className={`btn btn-secondary shrink-0 min-h-[40px] px-3 sm:px-4 text-xs font-semibold inline-flex items-center gap-1.5 ${
                slideIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Horizontal Scroll Slide Track */}
            <div className="flex-1 min-w-0 mx-1 sm:mx-2 flex items-center justify-center overflow-hidden">
              <div
                className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 px-1 scrollbar-thin scroll-smooth select-none"
                style={{
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {Array.from({ length: totalCards }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToSlide(i)}
                    aria-label={`Jump to slide ${i + 1}`}
                    className={`shrink-0 min-w-[34px] sm:min-w-[38px] h-[38px] px-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center cursor-pointer ${
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
                  className={`shrink-0 min-w-[44px] h-[38px] px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isClosing
                      ? 'bg-[var(--brand)] text-white shadow-xs'
                      : 'bg-[var(--surface-2)] text-[var(--text-dim)] hover:bg-[var(--brand-50)] hover:text-[var(--brand)]'
                  }`}
                >
                  End
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={goNext}
              className="btn btn-primary shrink-0 min-h-[40px] px-3 sm:px-4.5 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <span>{slideIndex === totalCards - 1 ? 'Summary' : isClosing ? 'Done' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Slide Description & Bot Presenter Column */}
        <div className="lg:col-span-4 flex flex-col justify-between p-3 sm:p-4 lg:p-5 card bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden h-full min-h-0 max-h-full">
          {/* Header Row: Slide Label + Hide Guide Button */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--border)] shrink-0">
            <div className="text-xs font-semibold text-[var(--navy)] truncate">
              {isClosing
                ? 'Summary · Architecture Verification'
                : currentCard?.title?.toLowerCase().startsWith('slide')
                ? `Slide ${slideIndex + 1} · ${currentCard?.type}`
                : `Slide ${slideIndex + 1} · ${currentCard?.title || ''}`}
            </div>

            {/* Guide Toggle: Hide / Show */}
            <button
              type="button"
              onClick={() => setIsGuideHidden((prev) => !prev)}
              className="inline-flex items-center px-2.5 py-1 rounded-md bg-[var(--surface)] hover:bg-[var(--surface-2)] text-xs font-medium text-slate-700 hover:text-[var(--brand)] border border-[var(--border)] transition-colors cursor-pointer shrink-0"
              aria-label={isGuideHidden ? 'Show Guide Mascot' : 'Hide Guide Mascot'}
            >
              <span>{isGuideHidden ? 'Show Guide' : 'Hide Guide'}</span>
            </button>
          </div>

          {/* Slide Description Content */}
          {hasText && currentCard?.description && (
            <div
              key={`desc-${slideIndex}`}
              className={`w-full flex flex-col mb-2 desc-fade-in ${
                isGuideHidden ? 'flex-1 max-h-none overflow-y-auto' : 'flex-[0_1_auto] max-h-none lg:max-h-[44%]'
              }`}
            >
              <div className="desc flex-1 lg:overflow-y-auto pr-0 sm:pr-2 space-y-2 text-[13.5px] sm:text-[15px] lg:text-[16px] leading-[1.6] text-[var(--text)] select-text max-w-[60ch]">
                {typeof currentCard.description === 'string' ? (
                  <p className="m-0 whitespace-pre-line">{currentCard.description}</p>
                ) : currentCard.description.blocks && currentCard.description.blocks.length > 0 ? (
                  currentCard.description.blocks.map((block, idx) => {
                    if (block.type === 'ul' && block.items) {
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1.5 my-1">
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (block.type === 'ol' && block.items) {
                      return (
                        <ol key={idx} className="list-decimal pl-5 space-y-1.5 my-1">
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ol>
                      );
                    }
                    return (
                      <p key={idx} className="m-0">
                        {block.text}
                      </p>
                    );
                  })
                ) : (
                  <p className="m-0 whitespace-pre-line">{currentCard.description.plain}</p>
                )}
              </div>
            </div>
          )}

          {/* Closing summary on final slide */}
          {isClosing && (
            <div
              key="desc-closing"
              className={`w-full flex flex-col mb-2 desc-fade-in ${
                isGuideHidden ? 'flex-1 max-h-none overflow-y-auto' : 'flex-[0_1_auto] max-h-none lg:max-h-[44%]'
              }`}
            >
              <div className="desc flex-1 lg:overflow-y-auto pr-0 sm:pr-2 space-y-2 text-[13.5px] sm:text-[15px] lg:text-[16px] leading-[1.6] text-[var(--text)] select-text max-w-[60ch]">
                <p className="m-0">
                  Enterprise solution review complete. Connect directly with our enterprise architecture practice to provision a dedicated live SAP BTP tenant and evaluate Clean Core compliance.
                </p>
              </div>
            </div>
          )}

          {/* Bottom: Bot Stage or Minimized Guide Bar */}
          {!isGuideHidden ? (
            <div ref={stageRef} className="w-full flex-1 min-h-0 lg:min-h-[38%] flex flex-col justify-end items-center relative mt-3 lg:mt-0 pt-2 border-t border-[var(--border)]">
              {/* Mobile In-Card Speech Bubble */}
              {isMobile && currentDialogue && (
                <div className="w-full mb-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between gap-1.5 mb-1.5 pb-1 border-b border-slate-200/80">
                    <span className="text-xs font-semibold text-slate-800">
                      Aayam · Solution Guide
                    </span>
                  </div>
                  {selectedPrompt && (
                    <div className="mb-2.5 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2 text-[11px] text-slate-700">
                      <span className="truncate font-medium">
                        <span className="text-[var(--brand)] font-semibold mr-1">Inquiry:</span>
                        {selectedPrompt.question}
                      </span>
                      <button
                        type="button"
                        onClick={handleResetPrompt}
                        className="shrink-0 text-[10.5px] font-medium text-[var(--brand)] hover:underline cursor-pointer"
                        title="Return to slide narration"
                      >
                        Return
                      </button>
                    </div>
                  )}
                  <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-[var(--navy)] m-0 font-normal">
                    {currentDialogue}
                  </p>
                  {quickPrompts && quickPrompts.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                      <span className="w-full text-[10.5px] font-medium text-slate-500">
                        Inquire with Architect:
                      </span>
                      {quickPrompts.map((p) => {
                        const isActive = selectedPrompt?.id === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              if (isActive) {
                                handleResetPrompt();
                              } else {
                                handleSelectPrompt(p);
                              }
                            }}
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                                : 'bg-slate-50/90 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:text-[var(--brand)]'
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Desktop Floating Speech Bubble (Above Hair) */}
              {!isMobile && currentDialogue && isBubbleOpen && (
                <BotBubble
                  key={bubbleKey}
                  text={currentDialogue}
                  speakerName="Aayam"
                  head={botHead}
                  topSafe={stageTop}
                  placement="top"
                  showTail={true}
                  durationMs={selectedPrompt ? 45000 : 30000}
                  onDismiss={() => setIsBubbleOpen(false)}
                  className="w-full max-w-sm mb-2"
                  quickPrompts={quickPrompts}
                  onSelectPrompt={handleSelectPrompt}
                  activePromptId={selectedPrompt?.id || null}
                  onResetPrompt={handleResetPrompt}
                  activeQuestion={selectedPrompt?.question || null}
                />
              )}

              {/* Mascot Sprite Standing on Pedestal with dynamically fitted height */}
              <button
                type="button"
                onClick={() => {
                  setIsBubbleOpen(true);
                  setBubbleKey((k) => k + 1);
                }}
                className="shrink-0 flex flex-col items-center justify-end relative cursor-pointer group bg-transparent border-0 p-0 focus:outline-none"
                title="Click Aayam to replay guidance"
              >
                <BotSprite
                  pose={currentPose}
                  heightPx={isMobile ? 125 : botHeight}
                  alt="Aayam Explaining"
                  priority={true}
                  onHeadPosition={handleHeadPosition}
                />
                {/* Soft Pedestal Shadow */}
                <div className="w-24 lg:w-32 h-2.5 lg:h-3.5 bg-black/10 rounded-full blur-[2px] mt-[-4px] lg:mt-[-6px] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="pt-2.5 flex items-center justify-between text-xs text-[var(--text-dim)] border-t border-[var(--border)] mt-auto shrink-0">
              <span className="text-[11px] font-medium text-slate-500">Mascot guide is hidden</span>
              <button
                type="button"
                onClick={() => setIsGuideHidden(false)}
                className="text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer"
              >
                Show Guide Mascot
              </button>
            </div>
          )}
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
