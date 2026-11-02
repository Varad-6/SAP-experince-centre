'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';
import { Bot, Sparkles, Volume2, VolumeX } from 'lucide-react';

export interface HoveringBotGuideProps {
  dialogue: string;
  cardIndex: number;
  totalCards?: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export const HoveringBotGuide: React.FC<HoveringBotGuideProps> = ({
  dialogue,
  cardIndex,
  totalCards = 8,
  onNext,
  onPrev,
}) => {
  const { botState, muted, setMuted } = useStore();
  const [displayedText, setDisplayedText] = useState('');
  const [minimized, setMinimized] = useState(false);

  // Typewriter effect with procedural audio chirps
  useEffect(() => {
    if (minimized) return;
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < dialogue.length) {
        setDisplayedText((prev) => prev + dialogue.charAt(i));
        if (i % 5 === 0) {
          audio.play('bot_chirp');
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [dialogue, minimized]);

  const mascotPoseImage =
    cardIndex === 7
      ? '/mascot/mascot_explaining.png' // Celebrate/action
      : cardIndex === 2 || cardIndex === 3 || cardIndex === 6
      ? '/mascot/mascot_pointing.png' // Pointing at diagram / live UI / metrics
      : cardIndex === 4 || cardIndex === 5
      ? '/mascot/mascot_explaining.png' // Explaining workflow / tech stack
      : '/mascot/mascot_standing.png'; // Standing intro

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none select-none">
      {/* 1. Chat Box emerging from the Bot's Brain */}
      {!minimized && (
        <div className="relative mb-3 max-w-sm sm:max-w-md pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1F44]/95 border border-[#00B8F5]/40 backdrop-blur-2xl shadow-2xl shadow-black/60 text-[#EAF2FF]">
            {/* Header with status pulse & mute toggle */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C8F8] animate-pulse" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  THE LEAD ARCHITECT
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#0070F2]/20 text-[#00B8F5] border border-[#00B8F5]/30">
                  SLIDE {cardIndex + 1}/08
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-1 rounded text-[#9FB3D1] hover:text-white cursor-pointer"
                  title="Toggle Audio"
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5 text-[#FF5C5C]" /> : <Volume2 className="w-3.5 h-3.5 text-[#00B8F5]" />}
                </button>
                <button
                  onClick={() => setMinimized(true)}
                  className="p-1 rounded text-[#9FB3D1] hover:text-white cursor-pointer text-xs"
                  title="Minimize Guide"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Typewritten Explanation */}
            <p className="text-xs sm:text-sm text-[#EAF2FF] leading-relaxed font-normal min-h-[48px]">
              {displayedText}
            </p>
          </div>

          {/* Pointer Stem connecting directly to the Bot's Head */}
          <div className="absolute -bottom-2 right-12 w-4 h-4 bg-[#0A1F44] border-r border-b border-[#00B8F5]/40 rotate-45" />
        </div>
      )}

      {/* 2. Hovering Animated Chibi Mascot */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {minimized && (
          <button
            onClick={() => setMinimized(false)}
            className="mr-2 px-3 py-1.5 rounded-xl bg-[#0A1F44]/90 border border-[#00B8F5]/30 text-xs font-mono text-[#00B8F5] hover:text-white shadow-xl cursor-pointer"
          >
            Show Guide
          </button>
        )}

        <div
          onClick={() => {
            audio.play('bot_chirp');
            setMinimized(false);
          }}
          className="relative group cursor-pointer animate-bounce"
          style={{ animationDuration: '3.5s' }}
        >
          {/* Subtle Ambient Hover Glow */}
          <div className="absolute -inset-2 rounded-full bg-[#0070F2]/20 blur-md group-hover:bg-[#00B8F5]/30 transition-all" />

          {/* Transparent Chibi Mascot Avatar */}
          <img
            src={mascotPoseImage}
            alt="Lead Architect Mascot"
            className="relative w-28 h-28 sm:w-32 sm:h-32 object-contain filter drop-shadow-[0_10px_20px_rgba(0,112,242,0.35)] hover:scale-105 transition-transform"
          />

          {/* Pedestal Shadow Decal */}
          <div className="w-20 h-3 bg-black/40 rounded-full blur-sm mx-auto mt-[-8px]" />
        </div>
      </div>
    </div>
  );
};
