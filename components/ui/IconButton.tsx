'use client';

import React from 'react';
import { audio } from '@/lib/audio';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  active = false,
  className = '',
  onClick,
  onMouseEnter,
  ...props
}) => {
  return (
    <button
      aria-label={label}
      title={label}
      className={`p-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
        active
          ? 'bg-[#0070F2]/30 border-[#00B8F5] text-[#00B8F5] shadow-[0_0_12px_rgba(0,184,245,0.3)]'
          : 'bg-[#102A5C]/40 border-white/10 text-[#9FB3D1] hover:text-[#EAF2FF] hover:border-white/25 hover:bg-[#102A5C]/70'
      } ${className}`}
      onMouseEnter={(e) => {
        audio.play('ui_hover');
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        audio.play('ui_click');
        onClick?.(e);
      }}
      {...props}
    >
      {icon}
    </button>
  );
};
