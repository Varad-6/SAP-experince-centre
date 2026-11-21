'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { placeBubble, BubblePlacement } from '@/lib/placeBubble';
import { QuickPrompt } from '@/lib/quickPrompts';

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
  quickPrompts?: QuickPrompt[];
  onSelectPrompt?: (prompt: QuickPrompt) => void;
  activePromptId?: string | null;
  onResetPrompt?: () => void;
  activeQuestion?: string | null;
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
  quickPrompts,
  onSelectPrompt,
  activePromptId,
  onResetPrompt,
  activeQuestion,
}) => {
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(true);

  // Bubble measured dimensions
  const [bubbleDim, setBubbleDim] = useState<{ w: number; h: number }>({ w: 340, h: 120 });
  const measureRef = useRef<HTMLDivElement>(null);

  // Resolved head coordinates
  const resolvedHeadX = head?.headX ?? headPos?.x ?? 0;
  const resolvedHairTopY = head?.hairTopY ?? headPos?.y ?? 0;
  const resolvedHeadW = head?.headW ?? 120;
  const hasHead = resolvedHeadX > 0 && resolvedHairTopY > 0;

  // Mount tracking to avoid SSR hydration mismatches
  const [isMounted, setIsMounted] = useState(false);

  // Viewport tracking
  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: 1280,
    h: 800,
  });

  useEffect(() => {
    setIsMounted(true);
    setViewport({ w: window.innerWidth, h: window.innerHeight });
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
  }, [text, activeQuestion, quickPrompts, activePromptId]);

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

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  // Reset visibility on text change
  useEffect(() => {
    setVisible(true);
  }, [text]);

  // Auto dismiss after generous reading duration
  useEffect(() => {
    if (!visible) return;

    const autoDuration = durationMs ?? Math.max(30000, text.length * 90);
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoDuration);

    return () => clearTimeout(timer);
  }, [visible, text, durationMs, onDismiss]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    onDismiss?.();
  };

  if (!isMounted || !captionsEnabled || !visible || !text) {
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
      forceAbove: placementOverride === 'top',
    });
  }

  const { mode, left, top, tailX } = placement;

  const bubbleNode = (
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
          minWidth: 260,
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-800">{speakerName} · Solution Guide</span>
          </div>
          {activeQuestion && (
            <div className="mb-2 px-2.5 py-1.5 text-[11px] font-medium">
              Inquiry: {activeQuestion}
            </div>
          )}
          <p className="text-[13.5px] leading-relaxed m-0 font-normal">{text}</p>
          {quickPrompts && quickPrompts.length > 0 && (
            <div className="mt-2.5 pt-2 flex flex-wrap gap-1.5">
              <span className="w-full text-[10.5px] font-medium text-slate-500">Inquire with Architect:</span>
              {quickPrompts.map((p) => (
                <span key={p.id} className="text-[11px] font-medium px-2.5 py-1 rounded-md">
                  {p.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Bubble Container */}
      <div
        style={{
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          maxWidth: 'min(400px, calc(100vw - 32px))',
          minWidth: 260,
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 150ms ease-out, transform 150ms ease-out',
        }}
        className={`select-none pointer-events-auto ${className}`}
        role="status"
        aria-live="polite"
      >
        <div
          className="relative px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-lg text-left"
          style={{
            boxShadow: '0 8px 24px -4px rgba(10, 31, 68, 0.12)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-800">
              {speakerName} · Solution Guide
            </span>
            <button
              type="button"
              onClick={handleCloseClick}
              aria-label="Dismiss guidance"
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Active Question Bar */}
          {activeQuestion && (
            <div className="mb-2.5 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2 text-[11px] text-slate-700">
              <span className="truncate font-medium">
                <span className="text-[var(--brand)] font-semibold mr-1">Inquiry:</span>
                {activeQuestion}
              </span>
              {onResetPrompt && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResetPrompt();
                  }}
                  className="shrink-0 text-[10.5px] font-medium text-[var(--brand)] hover:underline cursor-pointer"
                  title="Return to slide narration"
                >
                  Return
                </button>
              )}
            </div>
          )}

          {/* Dialogue Text Block */}
          <p className="text-[13.5px] leading-relaxed text-slate-800 m-0 font-normal select-text">
            {text}
          </p>

          {/* Architecture Inquiry Chips */}
          {quickPrompts && quickPrompts.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
              <span className="w-full text-[10.5px] font-medium text-slate-500">
                Inquire with Architect:
              </span>
              {quickPrompts.map((p) => {
                const isActive = activePromptId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isActive) {
                        onResetPrompt?.();
                      } else {
                        onSelectPrompt?.(p);
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

          {/* Clean Tail Triangle if above mode */}
          {showTail && mode === 'above' && tailX !== undefined && (
            <div
              className="absolute pointer-events-none -bottom-2"
              style={{
                left: `${tailX}px`,
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid #FFFFFF',
                filter: 'drop-shadow(0 1px 1px rgba(10, 31, 68, 0.08))',
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </>
  );

  return typeof document !== 'undefined' ? createPortal(bubbleNode, document.body) : bubbleNode;
};
