'use client';

import React from 'react';
import { audio } from '@/lib/audio';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  children,
  className = '',
  onClick,
  onMouseEnter,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
    lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#0070F2] to-[#00B8F5] text-white shadow-lg shadow-[#0070F2]/25 hover:brightness-110 active:scale-98',
    secondary:
      'bg-[#0A1F44] text-[#EAF2FF] border border-[#00B8F5]/30 hover:border-[#00B8F5]/60 hover:bg-[#102A5C]',
    glass:
      'bg-[#102A5C]/40 backdrop-blur-md text-[#EAF2FF] border border-white/10 hover:border-white/25 hover:bg-[#102A5C]/60',
    danger:
      'bg-gradient-to-r from-[#FF5C5C] to-[#E02424] text-white hover:brightness-110 shadow-lg shadow-[#FF5C5C]/25',
  }[variant];

  const glowClass = glow ? 'shadow-[0_0_24px_rgba(0,184,245,0.4)]' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${glowClass} ${className}`}
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
      {children}
    </button>
  );
};
