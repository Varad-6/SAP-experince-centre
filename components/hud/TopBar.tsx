'use client';

import React from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Subtitles, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BackButton } from './BackButton';
import { FullscreenButton } from './FullscreenButton';
import { VRButton } from './VRButton';
import { IconButton } from '../ui/IconButton';

export const TopBar: React.FC = () => {
  const { muted, setMuted, captions, setCaptions, quality, setQuality } = useStore();

  const cycleQuality = () => {
    const nextTier = quality === 'HIGH' ? 'MED' : quality === 'MED' ? 'LOW' : 'HIGH';
    setQuality(nextTier);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between pointer-events-auto">
      {/* Brand & Left Actions */}
      <div className="flex items-center gap-4">
        <BackButton />
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0070F2] to-[#00B8F5] flex items-center justify-center font-bold text-white text-xs tracking-wider shadow-lg shadow-[#0070F2]/30 group-hover:scale-105 transition-transform">
            AIS
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-white group-hover:text-[#00B8F5] transition-colors">
              EXPERIENCE CENTRE
            </span>
            <span className="text-[10px] font-mono text-[#9FB3D1]">
              ENTERPRISE ARCHITECTURE
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Links (Preserved existing routes) */}
      <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#102A5C]/40 border border-white/10 backdrop-blur-md">
        <Link
          href="/architecture"
          className="px-3 py-1 text-xs font-medium text-[#9FB3D1] hover:text-white rounded-full hover:bg-white/5 transition-colors"
        >
          Architecture
        </Link>
        <Link
          href="/prerequisites"
          className="px-3 py-1 text-xs font-medium text-[#9FB3D1] hover:text-white rounded-full hover:bg-white/5 transition-colors"
        >
          Prerequisites
        </Link>
        <Link
          href="/present"
          className="px-3 py-1 text-xs font-medium text-[#00B8F5] hover:text-white rounded-full hover:bg-[#00B8F5]/10 transition-colors"
        >
          Present Mode
        </Link>
      </nav>

      {/* Right Controls: Audio, Captions, Quality, VR, Fullscreen */}
      <div className="flex items-center gap-2">
        {/* Quality indicator badge */}
        <button
          onClick={cycleQuality}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#102A5C]/40 border border-white/10 text-[11px] font-mono text-[#9FB3D1] hover:text-white hover:border-[#00B8F5]/40 transition-colors cursor-pointer"
          title="Toggle Quality Tier (Auto/High/Med/Low)"
        >
          <Sparkles className="w-3 h-3 text-[#00B8F5]" />
          <span>{quality}</span>
        </button>

        {/* Captions Toggle */}
        <IconButton
          icon={<Subtitles className="w-4 h-4" />}
          label="Captions (C)"
          active={captions}
          onClick={() => setCaptions(!captions)}
        />

        {/* Audio Mute Toggle */}
        <IconButton
          icon={muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          label="Sound (M)"
          active={!muted}
          onClick={() => setMuted(!muted)}
        />

        {/* VR Session */}
        <VRButton />

        {/* Fullscreen */}
        <FullscreenButton />
      </div>
    </header>
  );
};
