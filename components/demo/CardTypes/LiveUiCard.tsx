'use client';

import React, { useState, useEffect } from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { Maximize2, X, ImageOff } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const LiveUiCard: React.FC<{ card: CardData }> = ({ card }) => {
  const [activeHotspot, setActiveHotspot] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [isDebug, setIsDebug] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDebug(params.get('debug') === '1' || process.env.NEXT_PUBLIC_DEBUG === '1');
    }
  }, []);

  // Close zoom modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomOpen(false);
    };
    if (isZoomOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isZoomOpen]);

  const hotspots = card.hotspots || [];
  const screenshot = card.screenshot || card.imageUrl || null;
  const currentHs = hotspots[activeHotspot] || hotspots[0];

  // If no screenshot exists
  if (!screenshot) {
    if (isDebug) {
      return (
        <div className="p-8 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] text-center flex flex-col items-center justify-center gap-2">
          <ImageOff className="w-8 h-8 text-[var(--text-dim)]" />
          <span className="text-xs font-mono text-[var(--text-dim)]">
            Screenshot pending: {card.title} / {card.badge || 'Slide'}
          </span>
        </div>
      );
    }
    // Full width description when no image
    return (
      <div className="space-y-4 py-4">
        {card.description && (
          <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
            {typeof card.description === 'string' ? card.description : card.description.plain}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {/* UI Screenshot Canvas with Hotspots and Zoom Action */}
      <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-slate-950/5 shadow-sm group">
        <div className="relative w-full flex items-center justify-center max-h-[min(48vh,420px)] overflow-hidden bg-black/5">
          <img
            src={screenshot}
            alt={card.title}
            className="w-full h-auto max-h-[min(48vh,420px)] object-contain block mx-auto select-none"
            loading="eager"
          />

          {/* Expand Lightbox Button */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            aria-label="Expand screenshot fullscreen"
            className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs transition-opacity shadow-sm cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Interactive Arrow Cursor targeting active callout */}
          {currentHs && (
            <div
              className="absolute z-30 pointer-events-none transition-all duration-300 ease-out"
              style={{
                left: `${currentHs.x}%`,
                top: `${currentHs.y}%`,
                transform: 'translate(8px, 8px)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#0070F2"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="drop-shadow-md animate-bounce"
              >
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
            </div>
          )}

          {/* Numbered Circle Hotspot Callouts */}
          {hotspots.map((hs, i) => (
            <div
              key={i}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                type="button"
                onClick={() => setActiveHotspot(i)}
                aria-label={`View callout ${i + 1}: ${hs.label}`}
                className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer font-bold text-xs transition-all duration-150 ${
                  activeHotspot === i
                    ? 'bg-[var(--navy)] text-white shadow-md scale-110 ring-2 ring-[var(--brand)]'
                    : 'bg-[var(--brand)] text-white hover:bg-[var(--brand-600)] hover:scale-105'
                }`}
              >
                <span>{i + 1}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Description / Caption / Hotspot Inspector */}
      {currentHs ? (
        <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[var(--brand)] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            {activeHotspot + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h5 className="text-xs sm:text-sm font-bold text-[var(--navy)] truncate">
                {currentHs.label}
              </h5>
              <span className="text-[10px] text-[var(--text-dim)] font-mono shrink-0">
                Callout {activeHotspot + 1} of {hotspots.length}
              </span>
            </div>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              {currentHs.tooltip}
            </p>
          </div>
        </div>
      ) : card.description ? (
        <p className="text-xs text-[var(--text-dim)] leading-relaxed line-clamp-2 px-1">
          {typeof card.description === 'string' ? card.description : card.description.plain}
        </p>
      ) : null}

      {/* Fullscreen Lightbox Modal */}
      {isZoomOpen && (
        <div
          style={{ zIndex: 70 }}
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            aria-label="Close fullscreen view"
            style={{ zIndex: 71 }}
            className="absolute top-4 right-4 z-[71] p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={screenshot}
              alt={card.title}
              className="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
