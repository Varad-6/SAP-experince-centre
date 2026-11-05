'use client';

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { X } from 'lucide-react';
import { placeBubble, BubblePlacement } from '@/lib/placeBubble';

export interface BotBubbleProps {
  text: string;
  speakerName?: string;
  headPos?: { x: number; y: number };
  head?: {
    headX: number;
    hairTopY: number;
    headW?: number;
  };
  placement?: 'top' | 'left' | 'right' | 'auto';
  topSafe?: number;
  onDismiss?: () => void;
  className?: string;
  durationMs?: number;
  showTail?: boolean;
}

export const BotBubble: React.FC<BotBubbleProps> = ({
  text,
  speakerName = 'Aayam',
  headPos,
  head,
  placement: placementOverride,
  topSafe = 64,
  onDismiss,
  className = '',
  durationMs,
  showTail = true,
}) => {
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(true);

  // Thought dots stagger phase: 0=none, 1=dot1, 2=dot2, 3=dot3, 4=bubble popped
  const [stagePhase, setStagePhase] = useState<number>(0);

  // Bubble measured dimensions
  const [bubbleDim, setBubbleDim] = useState<{ w: number; h: number }>({ w: 340, h: 120 });
  const measureRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Resolved head coordinates
  const resolvedHeadX = head?.headX ?? headPos?.x ?? 0;
  const resolvedHairTopY = head?.hairTopY ?? headPos?.y ?? 0;
  const resolvedHeadW = head?.headW ?? 120;
  const hasHead = resolvedHeadX > 0 && resolvedHairTopY > 0;

  // Viewport tracking
  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Pre-measure the hidden clone to reserve full dimensions
  useLayoutEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setBubbleDim({ w: Math.ceil(rect.width), h: Math.ceil(rect.height) });
      }
    }
  }, [text]);

  // Global 'C' shortcut to toggle captions / speech bubbles
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('ais.captions') : null;
    if (saved === '0') {
      setCaptionsEnabled(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'c' || e.key === 'C') {
        setCaptionsEnabled((prev) => {
          const next = !prev;
          sessionStorage.setItem('ais.captions', next ? '1' : '0');
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 90ms staggered reveal for thought dots, then bubble pop
  useEffect(() => {
    if (prefersReducedMotion) {
      setStagePhase(4);
      return;
    }

    setStagePhase(1);
    const t1 = setTimeout(() => setStagePhase(2), 90);
    const t2 = setTimeout(() => setStagePhase(3), 180);
    const t3 = setTimeout(() => setStagePhase(4), 270);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [text, prefersReducedMotion]);

  // Typing animation (22ms per char) after bubble pops
  useEffect(() => {
    if (!text) {
      setDisplayedCount(0);
      setIsTyping(false);
      return;
    }

    if (prefersReducedMotion || stagePhase < 4) {
      if (prefersReducedMotion) {
        setDisplayedCount(text.length);
        setIsTyping(false);
      }
      return;
    }

    setDisplayedCount(0);
    setIsTyping(true);
    startTimeRef.current = null;

    const msPerChar = 22;
    const totalChars = text.length;

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const count = Math.min(totalChars, Math.floor(elapsed / msPerChar));
      setDisplayedCount(count);

      if (count < totalChars) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setIsTyping(false);
      }
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [text, stagePhase, prefersReducedMotion]);

  // Auto dismiss after readingDuration
  useEffect(() => {
    if (isTyping || !visible || stagePhase < 4) return;

    const autoDuration = durationMs ?? Math.max(3500, text.length * 45);
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoDuration);

    return () => clearTimeout(timer);
  }, [isTyping, visible, stagePhase, text.length, durationMs, onDismiss]);

  const handleBubbleClick = useCallback(() => {
    if (isTyping) {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
      setDisplayedCount(text.length);
      setIsTyping(false);
    } else {
      setVisible(false);
      onDismiss?.();
    }
  }, [isTyping, text, onDismiss]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    onDismiss?.();
  };

  if (!captionsEnabled || !visible || !text) {
    return null;
  }

  // Calculate bubble placement
  let placement: BubblePlacement = {
    mode: 'above',
    left: Math.max(16, (viewport.w - bubbleDim.w) / 2),
    top: Math.max(topSafe + 8, viewport.h - bubbleDim.h - 100),
  };

  if (placementOverride === 'left' && !hasHead) {
    placement = {
      mode: 'left',
      left: Math.max(16, viewport.w - bubbleDim.w - 180),
      top: Math.max(topSafe + 8, viewport.h - bubbleDim.h - 80),
    };
  }

  if (hasHead) {
    placement = placeBubble({
      headX: resolvedHeadX,
      hairTopY: resolvedHairTopY,
      headW: resolvedHeadW,
      bw: bubbleDim.w,
      bh: bubbleDim.h,
      vw: viewport.w,
      vh: viewport.h,
      topSafe,
    });
  }

  const { mode, left, top, tailX, maxH } = placement;

  // Thought dots geometry:
  // sizes 6px, 9px, 12px (smallest nearest head), 6px spacing
  // R2: first dot 8px above hair top for 'above' mode
  const dots = [];
  if (hasHead && showTail) {
    if (mode === 'above') {
      const cx = resolvedHeadX;
      // Dot 1 (6px, r=3): center 8 + 3 = 11px above hairTopY
      const cy1 = resolvedHairTopY - 11;
      // Dot 2 (9px, r=4.5): 6px spacing -> 11 + 3 + 6 + 4.5 = 24.5px
      const cy2 = resolvedHairTopY - 24.5;
      // Dot 3 (12px, r=6): 6px spacing -> 24.5 + 4.5 + 6 + 6 = 41px
      const cy3 = resolvedHairTopY - 41;
      dots.push(
        { size: 6, cx, cy: cy1, step: 1 },
        { size: 9, cx, cy: cy2, step: 2 },
        { size: 12, cx, cy: cy3, step: 3 }
      );
    } else if (mode === 'right') {
      const startX = resolvedHeadX + resolvedHeadW / 2;
      const cy = resolvedHairTopY + 12;
      dots.push(
        { size: 6, cx: startX + 6, cy, step: 1 },
        { size: 9, cx: startX + 16, cy, step: 2 },
        { size: 12, cx: startX + 27, cy, step: 3 }
      );
    } else {
      const startX = resolvedHeadX - resolvedHeadW / 2;
      const cy = resolvedHairTopY + 12;
      dots.push(
        { size: 6, cx: startX - 6, cy, step: 1 },
        { size: 9, cx: startX - 16, cy, step: 2 },
        { size: 12, cx: startX - 27, cy, step: 3 }
      );
    }
  }

  return (
    <>
      {/* Hidden pre-measure clone to compute true bw and bh */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="fixed pointer-events-none opacity-0 z-[-1]"
        style={{
          top: -9999,
          left: -9999,
          width: 'max-content',
          maxWidth: 'min(380px, calc(100vw - 32px))',
          minWidth: 240,
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">{speakerName}</span>
          </div>
          <p className="text-[13.5px] leading-relaxed m-0 font-normal">{text}</p>
          <div className="mt-2 text-[10px] opacity-70">Press [C] for captions</div>
        </div>
      </div>

      {/* Thought Dots */}
      {dots.map((dot, idx) => (
        <div
          key={idx}
          className="fixed rounded-full transition-opacity duration-150 pointer-events-none z-50"
          style={{
            width: dot.size,
            height: dot.size,
            left: dot.cx - dot.size / 2,
            top: dot.cy - dot.size / 2,
            backgroundColor: 'rgba(255, 255, 255, 0.86)',
            border: '1px solid rgba(10, 31, 68, 0.12)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
            opacity: stagePhase >= dot.step ? 1 : 0,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Main Bubble Container */}
      <div
        style={{
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          maxWidth: 'min(380px, calc(100vw - 32px))',
          minWidth: 240,
          maxHeight: maxH ? `${maxH}px` : undefined,
          zIndex: 50,
          opacity: stagePhase >= 4 ? 1 : 0,
          transform: stagePhase >= 4 ? 'scale(1)' : 'scale(0.96)',
          transition: 'opacity 140ms ease-out, transform 140ms ease-out',
        }}
        className={`select-none pointer-events-auto ${className}`}
        onClick={handleBubbleClick}
        role="status"
        aria-live="polite"
      >
        <div
          className="relative px-4 py-3 cursor-pointer rounded-2xl shadow-lg border hover:border-[var(--brand)] transition-colors overflow-y-auto"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.86)',
            borderColor: 'rgba(10, 31, 68, 0.12)',
            boxShadow: '0 8px 24px -4px rgba(10, 31, 68, 0.12)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-[var(--brand)] uppercase">
                {speakerName}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCloseClick}
              aria-label="Close message"
              className="text-[var(--text-dim)] hover:text-[var(--text)] p-0.5 rounded transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          {/* Reserved full-height text block */}
          <div className="relative text-[13.5px] leading-relaxed text-[var(--navy)] m-0 font-normal">
            {/* Ghost invisible text to lock height from frame 1 */}
            <span className="invisible select-none block" aria-hidden="true">
              {text}
            </span>
            {/* Revealed text over ghost */}
            <span className="absolute inset-0">
              {text.slice(0, displayedCount)}
              {isTyping && (
                <span
                  className="inline-block w-1.5 h-3.5 ml-0.5 bg-[var(--brand)] align-middle animate-pulse"
                  aria-hidden="true"
                />
              )}
            </span>
          </div>

          {/* Footer Controls */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text-dim)]">
            <span>{isTyping ? 'Typing...' : 'Click to dismiss'}</span>
            <span className="text-[9px] font-mono opacity-60">Press [C] for captions</span>
          </div>

          {/* Small Tail Triangle if above mode */}
          {showTail && mode === 'above' && tailX !== undefined && (
            <div
              className="absolute pointer-events-none -bottom-2"
              style={{
                left: `${tailX}px`,
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '8px solid rgba(255, 255, 255, 0.86)',
                filter: 'drop-shadow(0 1px 1px rgba(10, 31, 68, 0.08))',
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </>
  );
};
