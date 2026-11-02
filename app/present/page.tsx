'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import solutionsData from '@/data/solutions.json';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Clock, 
  X, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function PresenterPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSolution = solutionsData[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex(i => (i < solutionsData.length - 1 ? i + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(i => (i > 0 ? i - 1 : solutionsData.length - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Presenter Bar */}
      <header className="h-14 px-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
            <span>Exit Presenter</span>
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-900/80 text-blue-300">
              {currentSolution.pillarName}
            </span>
            <span className="text-xs font-bold text-slate-200">
              {currentSolution.name}
            </span>
          </div>
        </div>

        {/* Center Controls & Timer */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTime(seconds)}</span>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            Slide <span className="text-white font-bold">{currentIndex + 1}</span> of {solutionsData.length}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Slide Stage (16:9 Aspect Ratio) */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="text-xs font-bold text-sap-blue uppercase tracking-wider mb-2">
                  {currentSolution.pillarName} · {currentSolution.team}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                  {currentSolution.name}
                </h1>
                <p className="text-base md:text-lg text-slate-300 font-medium mt-2">
                  {currentSolution.tagline}
                </p>
              </div>

              {/* 3 Step Flow */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {currentSolution.flow.map((st, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="w-6 h-6 rounded bg-sap-blue text-white text-xs font-bold flex items-center justify-center mb-2">
                      {st.step}
                    </div>
                    <div className="text-xs font-bold text-slate-100">{st.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{st.description}</div>
                  </div>
                ))}
              </div>

              {/* Touchpoints */}
              <div className="flex flex-wrap gap-2 pt-2">
                {currentSolution.sapTouchpoints.map((tp, i) => (
                  <span key={i} className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-blue-950 text-blue-300 border border-blue-900">
                    {tp}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Hero ROI Box */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-emerald-950/40 border border-emerald-500/30 text-center">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  MEASURED ENTERPRISE ROI
                </span>
                <div className="text-4xl md:text-5xl font-black text-emerald-400 mt-2 mb-1">
                  {currentSolution.heroKpi.value}
                </div>
                <div className="text-xs font-bold text-slate-200 uppercase">
                  {currentSolution.heroKpi.label}
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  {currentSolution.heroKpi.description}
                </p>
              </div>

              {currentSolution.demoUrl && (
                <a
                  href={currentSolution.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-sap-blue hover:bg-sap-darkBlue text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Bottom Navigation Dock */}
      <footer className="h-16 px-8 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(i => (i > 0 ? i - 1 : solutionsData.length - 1))}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Solution</span>
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {solutionsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-sap-blue' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex(i => (i < solutionsData.length - 1 ? i + 1 : 0))}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sap-blue text-white hover:bg-sap-darkBlue transition text-xs font-bold shadow-md shadow-blue-500/20"
        >
          <span>Next Solution</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
