'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/sound';

export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [muted, setMuted] = useState(sound.isMuted());

  useEffect(() => {
    const handleToggle = (e: any) => {
      setMuted(e.detail.muted);
    };
    window.addEventListener('ais:sound_toggle', handleToggle);
    return () => window.removeEventListener('ais:sound_toggle', handleToggle);
  }, []);

  const toggle = () => {
    const next = !muted;
    sound.setMuted(next);
    setMuted(next);
    if (!next) {
      sound.click();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={muted ? 'Unmute UI sounds (M)' : 'Mute UI sounds (M)'}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      className={`p-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5 text-xs font-semibold ${className}`}
    >
      {muted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[var(--brand)]" />}
      <span className="hidden sm:inline font-mono text-[11px] opacity-75">
        {muted ? 'Sound: OFF' : 'Sound: ON'}
      </span>
    </button>
  );
};
