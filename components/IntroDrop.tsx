'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { BotSprite } from '@/components/BotSprite';
import { PoseName } from '@/lib/poses';
import siteData from '@/content/site.json';
import { Sparkles, X } from 'lucide-react';

export const IntroDrop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const droneRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const chuteRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [botPose, setBotPose] = useState<PoseName>('idle');
  const [bubbleText, setBubbleText] = useState<string>('');
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [showSkipBtn, setShowSkipBtn] = useState<boolean>(true);

  const introLines = siteData.introLines || [
    'Welcome to Abhiyanta India Solutions.',
    "I'm your Lead Architect bot.",
    'Explore 28 production SAP & AI solutions across 5 pillars.',
  ];

  // Helper to skip directly to finished ground state
  const skipIntro = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    try {
      sessionStorage.setItem('ais.intro', '1');
    } catch {
      // ignore
    }
    setIsSkipped(true);
    setShowSkipBtn(false);
    setBotPose('idle');
    setBubbleText(introLines[introLines.length - 1] || 'Welcome to Abhiyanta!');

    // Instantly place bot on ground
    if (botRef.current) {
      gsap.set(botRef.current, {
        clearProps: 'all',
        position: 'absolute',
        bottom: '8%',
        right: '12%',
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
      });
    }
    if (droneRef.current) gsap.set(droneRef.current, { display: 'none', opacity: 0 });
    if (chuteRef.current) gsap.set(chuteRef.current, { display: 'none', opacity: 0 });
    if (bubbleRef.current) gsap.set(bubbleRef.current, { opacity: 1, y: 0, scale: 1 });
  }, [introLines]);

  useEffect(() => {
    // 1. Check for reduced motion or cached session
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isAlreadySeen =
      typeof window !== 'undefined' && sessionStorage.getItem('ais.intro') === '1';

    if (isReducedMotion || isAlreadySeen) {
      skipIntro();
      return;
    }

    // 2. Setup Keyboard listener for Esc
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Initial states before animation
    const drone = droneRef.current;
    const bot = botRef.current;
    const chute = chuteRef.current;
    const bubble = bubbleRef.current;

    if (!drone || !bot || !chute || !bubble) return;

    setBotPose('fly');
    gsap.set(drone, { x: '120vw', y: '-15vh', opacity: 1, display: 'block' });
    gsap.set(bot, { x: '120vw', y: '-5vh', opacity: 1, rotation: 0 });
    gsap.set(chute, { scale: 0, opacity: 0 });
    gsap.set(bubble, { opacity: 0, scale: 0.9, y: 10 });

    // 4. GSAP Master Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem('ais.intro', '1');
        } catch {
          // ignore
        }
        setShowSkipBtn(false);
      },
    });
    timelineRef.current = tl;

    // Phase A: Drone enters carrying bot (t=0..1.2s)
    tl.to(drone, {
      x: '62vw',
      y: '22vh',
      duration: 1.2,
      ease: 'power2.out',
    }, 0);

    tl.to(bot, {
      x: '62vw',
      y: '32vh',
      duration: 1.2,
      ease: 'power2.out',
    }, 0);

    // Phase B: Bot drops, parachute deploys (t=1.2..1.5s)
    tl.to(bot, {
      y: '42vh',
      duration: 0.35,
      ease: 'power1.in',
      onStart: () => setBotPose('fall'),
    }, 1.2);

    tl.to(chute, {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      ease: 'back.out(1.8)',
    }, 1.3);

    // Phase C: Bot drifts down gently swaying (t=1.5..3.0s)
    tl.to(bot, {
      y: '62vh',
      x: '60vw',
      duration: 1.5,
      ease: 'sine.inOut',
      onStart: () => setBotPose('fly'),
    }, 1.5);

    tl.to(bot, {
      rotation: -6,
      duration: 0.45,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 3,
    }, 1.5);

    // Drone exits top-left (t=1.8..3.2s)
    tl.to(drone, {
      x: '-25vw',
      y: '-10vh',
      duration: 1.4,
      ease: 'power2.in',
    }, 1.8);

    // Phase D: Touchdown on ground strip (t=3.0..3.4s)
    tl.to(bot, {
      y: '68vh',
      rotation: 0,
      duration: 0.3,
      ease: 'power2.out',
      onStart: () => {
        setBotPose('fall');
        // Parachute collapses and fades
        gsap.to(chute, { opacity: 0, scaleY: 0.2, duration: 0.2 });
      },
    }, 3.0);

    tl.add(() => {
      setBotPose('wave');
    }, 3.3);

    // Phase E: Speech bubble pop & typewriter text (t=3.5s+)
    tl.to(bubble, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'back.out(1.5)',
    }, 3.5);

    // Typewriter effect through introLines
    tl.add(() => {
      let currentLineIdx = 0;

      const typeNextLine = () => {
        if (currentLineIdx >= introLines.length) {
          setBotPose('idle');
          return;
        }

        const text = introLines[currentLineIdx];
        let charIdx = 0;
        const interval = setInterval(() => {
          charIdx++;
          setBubbleText(text.slice(0, charIdx));
          if (charIdx >= text.length) {
            clearInterval(interval);
            currentLineIdx++;
            if (currentLineIdx < introLines.length) {
              setTimeout(typeNextLine, 1200);
            } else {
              setTimeout(() => setBotPose('idle'), 800);
            }
          }
        }, 28);
      };

      typeNextLine();
    }, 3.6);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (tl) tl.kill();
    };
  }, [introLines, skipIntro]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
      aria-label="Drone & Bot Landing Intro"
    >
      {/* Skip Button (top right, pointer-events-auto) */}
      {showSkipBtn && !isSkipped && (
        <button
          onClick={skipIntro}
          className="absolute top-4 right-6 pointer-events-auto text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--brand)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          title="Skip animation (Esc)"
        >
          <span>Skip intro (Esc)</span>
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* 2D Drone Graphic */}
      <div
        ref={droneRef}
        className="absolute top-0 left-0 w-36 h-20 -translate-x-1/2 -translate-y-1/2 select-none"
        style={{ display: isSkipped ? 'none' : 'block' }}
      >
        <img
          src="/assets/drone.svg"
          alt="AIS Quadcopter Drone"
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </div>

      {/* Dropping Bot Container */}
      <div
        ref={botRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      >
        {/* Parachute Attached above Bot */}
        <div
          ref={chuteRef}
          className="w-48 h-36 -mb-10 select-none origin-bottom"
          style={{ display: isSkipped ? 'none' : 'block' }}
        >
          <img
            src="/assets/parachute.svg"
            alt="Parachute"
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        </div>

        {/* Bot Character Sprite */}
        <div className="relative">
          <BotSprite pose={botPose} width={160} height={160} alt="Lead Architect Bot" />
          <div className="w-24 h-3 bg-black/10 rounded-full blur-[2px] mx-auto mt-[-6px]" />
        </div>

        {/* Interactive Speech Bubble */}
        <div
          ref={bubbleRef}
          className="relative mt-2 p-3.5 sm:p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] text-xs sm:text-sm text-[var(--text)] max-w-[280px] sm:max-w-[340px] pointer-events-auto transition-all"
        >
          <div className="text-xs font-bold text-[var(--brand)] mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{siteData.botName || 'The Lead Architect'}</span>
          </div>
          <p className="leading-snug min-h-[38px] text-[var(--text)]">
            {bubbleText || introLines[0]}
          </p>
        </div>
      </div>
    </div>
  );
};
