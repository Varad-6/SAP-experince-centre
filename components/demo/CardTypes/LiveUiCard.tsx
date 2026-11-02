'use client';

import React, { useState } from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { Info, Sparkles, MapPin } from 'lucide-react';
import { audio } from '@/lib/audio';

type CardData = z.infer<typeof CardSchema>;

export const LiveUiCard: React.FC<{ card: CardData }> = ({ card }) => {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);

  const hotspots = card.hotspots || [];
  const screenshot = card.screenshot || '/assets/apps/podzo/screen-1.png';

  return (
    <div className="space-y-4">
      {/* UI Screenshot Canvas with Hotspots */}
      <div className="relative rounded-2xl overflow-hidden border border-[#00B8F5]/30 bg-[#050E22] group shadow-2xl">
        <img
          src={screenshot}
          alt={card.title}
          className="w-full h-auto object-cover max-h-[380px]"
          onError={(e) => {
            // Graceful fallback to procedural placeholder if missing
            (e.target as HTMLImageElement).src = '/assets/apps/podzo/screen-1.png';
          }}
        />

        {/* Hotspot Markers */}
        {hotspots.map((hs, i) => (
          <div
            key={i}
            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <button
              onClick={() => {
                audio.play('ui_click');
                setActiveHotspot(i);
              }}
              onMouseEnter={() => {
                audio.play('ui_hover');
              }}
              className={`relative flex items-center justify-center w-7 h-7 rounded-full cursor-pointer transition-all duration-200 ${
                activeHotspot === i
                  ? 'bg-[#00B8F5] text-white scale-125 shadow-[0_0_16px_#00B8F5]'
                  : 'bg-[#0A1F44]/90 border border-white/40 text-white hover:scale-110 hover:border-[#00B8F5]'
              }`}
            >
              <span className="text-[10px] font-bold">{i + 1}</span>
              <span className="absolute -inset-1 rounded-full border border-[#00B8F5] animate-ping opacity-60" />
            </button>
          </div>
        ))}
      </div>

      {/* Active Hotspot Inspector Card */}
      {activeHotspot !== null && hotspots[activeHotspot] && (
        <div className="p-4 rounded-xl bg-[#0A1F44]/90 border border-[#00B8F5]/40 backdrop-blur-md flex items-start gap-3 animate-in fade-in">
          <div className="w-6 h-6 rounded-lg bg-[#0070F2] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            {activeHotspot + 1}
          </div>
          <div>
            <h5 className="text-xs font-bold text-white mb-0.5">
              {hotspots[activeHotspot].label}
            </h5>
            <p className="text-xs text-[#9FB3D1] leading-relaxed">
              {hotspots[activeHotspot].tooltip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
