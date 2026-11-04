'use client';

import React, { useState } from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { Info } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const LiveUiCard: React.FC<{ card: CardData }> = ({ card }) => {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);

  const hotspots = card.hotspots || [];
  const screenshot = card.screenshot || '/assets/apps/podzo/screen-1.png';

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
      {activeHotspot !== null && hotspots[activeHotspot] && (
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[var(--brand)] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            {activeHotspot + 1}
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-bold text-[var(--navy)] mb-0.5">
              {hotspots[activeHotspot].label}
            </h5>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              {hotspots[activeHotspot].tooltip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
