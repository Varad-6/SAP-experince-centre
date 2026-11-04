'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { sound } from '@/lib/sound';

export interface BotBubbleProps {
  text: string;
  speakerName?: string;
  headPos?: { x: number; y: number };
  placement?: 'top' | 'left' | 'right' | 'auto';
  onDismiss?: () => void;
  className?: string;
  durationMs?: number;
  showTail?: boolean;
}

export const BotBubble: React.FC<BotBubbleProps> = ({
  text,
  speakerName = 'Lead Architect',
  headPos,
  placement = 'auto',
  onDismiss,
  className = '',
  durationMs,
  showTail = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [visible, setVisible] = useState(true);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Global 'C' shortcut to toggle captions / speech bubbles
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('ais.captions') : null;
    if (saved === '0') {
      setCaptionsEnabled(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when focused in an input/textarea
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

  // Typing animation via requestAnimationFrame (22ms per char)
  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    startTimeRef.current = null;

    const msPerChar = 22;
    const totalChars = text.length;

    let lastSoundChar = 0;
    const step = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const count = Math.min(totalChars, Math.floor(elapsed / msPerChar));
      setDisplayedText(text.slice(0, count));

      if (count > lastSoundChar && count % 2 === 0) {
        lastSoundChar = count;
        sound.typeChirp();
      }

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
  }, [text, prefersReducedMotion]);

  // Handle dismiss after readingDuration = max(3500ms, text.length * 45ms)
  useEffect(() => {
    if (isTyping || !visible) return;

    const autoDuration = durationMs ?? Math.max(3500, text.length * 45);
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoDuration);

    return () => clearTimeout(timer);
  }, [isTyping, visible, text.length, durationMs, onDismiss]);

  const handleBubbleClick = useCallback(() => {
    if (isTyping) {
      // Fast forward typing
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      // Dismiss
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

  // Determine computed placement relative to head position if headPos is supplied
  let posStyle: React.CSSProperties = {};
  let resolvedPlacement = placement;

  if (headPos) {
    if (placement === 'auto') {
      resolvedPlacement = headPos.y > 200 ? 'top' : 'left';
    }

    if (resolvedPlacement === 'top') {
      posStyle = {
        position: 'fixed',
        left: `clamp(16px, ${headPos.x - 140}px, calc(100vw - 340px))`,
        bottom: `calc(100vh - ${headPos.y}px + 28px)`,
        zIndex: 50,
      };
    } else if (resolvedPlacement === 'left') {
      posStyle = {
        position: 'fixed',
        right: `calc(100vw - ${headPos.x}px + 24px)`,
        top: `clamp(16px, ${headPos.y - 40}px, calc(100vh - 160px))`,
        zIndex: 50,
      };
    } else {
      posStyle = {
        position: 'fixed',
        left: `${headPos.x + 24}px`,
        top: `clamp(16px, ${headPos.y - 40}px, calc(100vh - 160px))`,
        zIndex: 50,
      };
    }
  }

  return (
    <div
      style={posStyle}
      className={`relative select-none pointer-events-auto ${className}`}
      onClick={handleBubbleClick}
      role="status"
      aria-live="polite"
    >
      {/* 3-Circle Thinking Tail */}
      {showTail && (
        <div
          className={`absolute pointer-events-none flex flex-col items-center ${
            resolvedPlacement === 'top'
              ? '-bottom-6 left-8 flex-col space-y-1'
              : resolvedPlacement === 'left'
              ? '-right-6 top-6 flex-row space-x-1'
              : '-left-6 top-6 flex-row-reverse space-x-1'
          }`}
          aria-hidden="true"
        >
          <div
            className="rounded-full bg-white border border-[var(--border)] shadow-sm"
            style={{ width: 12, height: 12, opacity: 0.95 }}
          />
          <div
            className="rounded-full bg-white border border-[var(--border)] shadow-sm"
            style={{ width: 9, height: 9, opacity: 0.85 }}
          />
          <div
            className="rounded-full bg-white border border-[var(--border)] shadow-sm"
            style={{ width: 6, height: 6, opacity: 0.7 }}
          />
        </div>
      )}

      {/* Main Bubble Body */}
      <div
        className="card px-3.5 py-2.5 max-w-[min(360px,calc(100vw-32px))] min-w-[220px] transition-all duration-200 cursor-pointer hover:border-[var(--brand)]"
        style={{
          background: 'var(--bubble-bg, rgba(255, 255, 255, 0.92))',
          borderRadius: 14,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide text-[var(--brand)] uppercase">
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

        <p className="text-[13.5px] leading-snug text-[var(--text)] m-0">
          {displayedText}
          {isTyping && (
            <span
              className="inline-block w-1.5 h-3 ml-0.5 bg-[var(--brand)] align-middle animate-pulse"
              aria-hidden="true"
            />
          )}
        </p>

        <div className="mt-1.5 flex items-center justify-between text-[10px] text-[var(--text-dim)]">
          <span>{isTyping ? 'Typing...' : 'Click to dismiss'}</span>
          <span className="text-[9px] font-mono opacity-60">Press [C] for captions</span>
        </div>
      </div>
    </div>
  );
};
