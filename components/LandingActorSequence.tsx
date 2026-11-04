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
  const [currentAct, setCurrentAct] = useState<1 | 2 | 3 | 'done'>(1);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);
  const [hasVisited, setHasVisited] = useState<boolean>(false);

  const introLines = siteData.introLines || [
    "Hi, I'm the Lead Architect bot at Abhiyanta India Solutions.",
    "We build enterprise AI, SAP BTP extensions, and real-time operational copilots.",
    "Explore our 5 architectural pillars and 28 production solutions.",
  ];

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      const visited = sessionStorage.getItem('ais.intro');
      if (visited === '1') {
        setHasVisited(true);
        setCurrentAct('done');
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
    setCurrentAct('done');
    onSequenceComplete?.();
  }, [onSequenceComplete]);

  const skipIntro = useCallback(() => {
    try {
      sessionStorage.setItem('ais.intro', '1');
    } catch {
      // ignore
    }
    setCurrentAct('done');
    onSequenceComplete?.();
  }, [onSequenceComplete]);

  const replayIntro = useCallback(() => {
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
            bubbleStartSec={8.6}
            onEnded={handleAct1End}
            className="w-full h-full"
          />
        )}

        {currentAct === 2 && (
          <ActorVideo
            name="analytics_laptop"
            bubbleText={introLines[1]}
            bubbleStartSec={4.5}
            onEnded={handleAct2End}
            className="w-full h-full"
          />
        )}

        {currentAct === 3 && (
          <ActorVideo
            name="explain_close"
            bubbleText={introLines[2]}
            bubbleStartSec={1.0}
            onEnded={handleAct3End}
            className="w-full h-full"
          />
        )}

        {currentAct === 'done' && (
          /* Finished State: Act 3 hold frame or standing sprite greeting */
          <div className="relative w-full h-full flex items-end justify-center">
            <img
              src="/assets/video/explain_close_last.png"
              alt="Lead Architect Ready"
              className="w-full h-full object-contain pointer-events-none"
            />
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <BotBubble
                text={introLines[2]}
                durationMs={12000}
                placement="top"
              />
            </div>
          </div>
        )}
      </div>

      {/* Skip / Replay Controls */}
      <div className="absolute bottom-4 left-6 sm:left-8 z-30 pointer-events-auto flex items-center gap-3">
        {currentAct !== 'done' ? (
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
