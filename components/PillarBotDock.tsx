'use client';

import React, { useState } from 'react';
import { BotSprite } from '@/components/BotSprite';
import { BotBubble } from '@/components/BotBubble';

export function PillarBotDock() {
  const [showBubble, setShowBubble] = useState(true);

  return (
    <aside
      className="fixed bottom-6 right-6 z-30 flex items-end gap-3 pointer-events-auto"
      onMouseEnter={() => setShowBubble(true)}
    >
      {showBubble && (
        <BotBubble
          text="Click a project card to view its architecture and demo."
          durationMs={6000}
          placement="left"
          onDismiss={() => setShowBubble(false)}
        />
      )}

      <div
        className="relative cursor-pointer group shrink-0"
        onClick={() => setShowBubble((prev) => !prev)}
      >
        <BotSprite pose="point" heightPx={130} alt="Lead Architect Bot Pointing" />
        <div className="w-16 h-2 bg-black/10 rounded-full blur-[2px] mx-auto mt-[-4px]" />
      </div>
    </aside>
  );
}
