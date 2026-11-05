'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ActorVideo } from './ActorVideo';
import { BotSprite } from './BotSprite';
import { BotBubble } from './BotBubble';
import { ArrowRight, RotateCcw, FastForward } from 'lucide-react';
import siteData from '@/content/site.json';

interface LandingActorSequenceProps {
  onSequenceComplete?: () => void;
}

export const LandingActorSequence: React.FC<LandingActorSequenceProps> = ({
  onSequenceComplete,
}) => {
  const [currentAct, setCurrentAct] = useState<1 | 2 | 3>(1);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const introLines = siteData.introLines || [
    "Hello everyone! Parachuting is definitely my favorite adventure sport... but do you know what excites me even more?",
    "Exploring frontier technology, Generative AI, and predictive analytics! Let me walk you through the game-changing innovations Abhiyanta has built.",
    "Hi, I'm Aayam! We have engineered production-grade Clean Core solutions designed to modernize enterprise operations and shape the future of business.",
  ];

  // Check sessionStorage on mount (if user already watched intro, start on Act 3 hold frame)
  useEffect(() => {
    try {
      const visited = sessionStorage.getItem('ais.intro');
      if (visited === '1') {
        setCurrentAct(3);
        setIsFinished(true);
        onSequenceComplete?.();
      }
    } catch {
      // ignore
    }
  }, [onSequenceComplete]);

  const handleAct1End = useCallback(() => {
    setIsCrossfading(true);
    setTimeout(() => {
      setCurrentAct(2);
      setIsCrossfading(false);
    }, 400);
  }, []);

  const handleAct2End = useCallback(() => {
    setIsCrossfading(true);
    setTimeout(() => {
      setCurrentAct(3);
      setIsCrossfading(false);
    }, 400);
  }, []);

  const handleAct3End = useCallback(() => {
    try {
      sessionStorage.setItem('ais.intro', '1');
    } catch {
      // ignore
    }
    setIsFinished(true);
    onSequenceComplete?.();
  }, [onSequenceComplete]);

  const skipIntro = useCallback(() => {
    try {
      sessionStorage.setItem('ais.intro', '1');
    } catch {
      // ignore
    }
    setCurrentAct(3);
    setIsFinished(true);
    onSequenceComplete?.();
  }, [onSequenceComplete]);

  const replayIntro = useCallback(() => {
    try {
      sessionStorage.removeItem('ais.intro');
    } catch {
      // ignore
    }
    setIsFinished(false);
    setCurrentAct(1);
    setIsCrossfading(false);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end">
      {/* 3-Act Video Stage */}
      <div
        className={`absolute bottom-0 right-0 w-[clamp(380px,46vw,760px)] aspect-video transition-opacity duration-400 ${
          isCrossfading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          // Bottom edge meets the ground strip
          transform: 'translateY(12px)',
        }}
      >
        {currentAct === 1 && (
          <ActorVideo
            name="intro_drop"
            bubbleText={introLines[0]}
            bubbleStartSec={1.8}
            onEnded={handleAct1End}
            className="w-full h-full"
          />
        )}

        {currentAct === 2 && (
          <ActorVideo
            name="analytics_laptop"
            bubbleText={introLines[1]}
            bubbleStartSec={1.2}
            onEnded={handleAct2End}
            className="w-full h-full"
          />
        )}

        {currentAct === 3 && (
          <ActorVideo
            name="explain_close"
            bubbleText={introLines[2]}
            bubbleStartSec={isFinished ? 0 : 0.8}
            onEnded={handleAct3End}
            holdLastFrame={true}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Skip / Replay Controls */}
      <div className="absolute bottom-4 left-6 sm:left-8 z-30 pointer-events-auto flex items-center gap-3">
        {!isFinished ? (
          <button
            type="button"
            onClick={skipIntro}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)]/90 backdrop-blur border border-[var(--border)] text-xs font-semibold text-[var(--navy)] hover:text-[var(--brand)] shadow-sm transition-all"
          >
            <FastForward size={14} />
            <span>Skip intro</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={replayIntro}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)]/90 backdrop-blur border border-[var(--border)] text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--brand)] shadow-sm transition-all"
          >
            <RotateCcw size={13} />
            <span>Replay intro</span>
          </button>
        )}
      </div>
    </div>
  );
};
