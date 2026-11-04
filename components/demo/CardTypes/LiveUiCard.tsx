'use client';

import React, { useState } from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { MousePointer } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const LiveUiCard: React.FC<{ card: CardData }> = ({ card }) => {
  const [activeHotspot, setActiveHotspot] = useState<number>(0);

  const hotspots = card.hotspots || [];
  const screenshot = card.screenshot || '/assets/apps/podzo/screen-1.png';

  const currentHs = hotspots[activeHotspot] || hotspots[0];

  return (
    <div className="space-y-4">
      {/* UI Screenshot Canvas with Hotspots in 16:9 Card */}
      <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shadow-sm">
        <div className="aspect-video w-full relative flex items-center justify-center overflow-hidden">
          <img
            src={screenshot}
            alt={card.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/bot/_placeholder.svg';
            }}
          />

          {/* Moving 20px Arrow Cursor targeting the active callout */}
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

          {/* Numbered Circle Hotspot Callouts (24px, #0070F2, white text) */}
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

      {/* Active Hotspot Inspector Card */}
      {currentHs && (
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[var(--brand)] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            {activeHotspot + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h5 className="text-xs sm:text-sm font-bold text-[var(--navy)]">
                {currentHs.label}
              </h5>
              <span className="text-[10px] text-[var(--text-dim)] font-mono">
                Callout {activeHotspot + 1} of {hotspots.length}
              </span>
            </div>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              {currentHs.tooltip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
