'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { audio } from '@/lib/audio';
import { Bot, Sparkles, Volume2, X } from 'lucide-react';

export type GuideMode = 'ON' | 'TOUR_ONLY' | 'OFF';

export interface DirectorProps {
  dialogue?: string;
  solutionTitle?: string;
}

export const Director: React.FC<DirectorProps> = ({ dialogue, solutionTitle }) => {
  const { botState, scene } = useStore();
  const [guideMode, setGuideMode] = useState<GuideMode>('ON');
  const [displayedText, setDisplayedText] = useState('');
  const [minimized, setMinimized] = useState(false);

  const activeText =
    dialogue ||
    (scene === 'LANDING'
      ? "Welcome to the AIS Experience Centre! I'm your Lead Architect. Explore our 28 enterprise SAP solutions across 5 Clean Core pillars."
      : scene === 'PILLARS'
      ? "Select any of the 5 architectural pillars to inspect our production SAP BTP, AI, and SAC capabilities."
      : `Inspecting ${solutionTitle || 'enterprise solution'}. Ready to launch the full interactive simulation?`);

  // Typewriter effect with subtle audio chirps
  useEffect(() => {
    if (guideMode === 'OFF' || minimized) return;

    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < activeText.length) {
        setDisplayedText((prev) => prev + activeText.charAt(i));
        if (i % 6 === 0) {
          audio.play('bot_chirp');
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [activeText, guideMode, minimized]);

  if (guideMode === 'OFF') {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setGuideMode('ON')}
          className="px-3 py-1.5 rounded-full bg-[#0A1F44]/90 border border-white/15 text-xs text-[#9FB3D1] hover:text-white flex items-center gap-2 backdrop-blur-md cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-[#00B8F5]" />
          <span>Guide: OFF (Click to Enable)</span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Lead Architect Guide" className="fixed bottom-6 right-6 z-40 max-w-sm pointer-events-auto select-none animate-in fade-in slide-in-from-bottom-2">
      {/* Speech Bubble */}
      {!minimized && (
        <div className="mb-3 p-4 rounded-2xl bg-[#0A1F44]/95 border border-[#00B8F5]/30 backdrop-blur-xl shadow-2xl text-[#EAF2FF] relative">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00B8F5] animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">
                THE LEAD ARCHITECT
              </span>
            </div>
            {/* Guide Agency Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#102A5C]/60 rounded-lg p-0.5 border border-white/10 text-[10px]">
              {(['ON', 'TOUR_ONLY', 'OFF'] as GuideMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setGuideMode(mode)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    guideMode === mode
                      ? 'bg-[#0070F2] text-white font-semibold'
                      : 'text-[#9FB3D1] hover:text-white'
                  }`}
                >
                  {mode === 'TOUR_ONLY' ? 'TOUR' : mode}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-[#EAF2FF] font-normal min-h-[36px]">
            {displayedText}
          </p>

          {/* Minimizer close button */}
          <button
            onClick={() => setMinimized(true)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#102A5C] border border-white/20 text-[#9FB3D1] hover:text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
            title="Minimize"
          >
            ✕
          </button>
        </div>
      )}

      {/* Minimized toggle button */}
      {minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="p-3 rounded-full bg-gradient-to-r from-[#0070F2] to-[#00B8F5] text-white shadow-xl shadow-[#0070F2]/40 hover:scale-105 transition-transform flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>Architect Guide</span>
        </button>
      )}
    </aside>
  );
};
