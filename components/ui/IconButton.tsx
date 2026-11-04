'use client';

import React from 'react';

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
  ...props
}) => {
  return (
    <button
      aria-label={label}
      title={label}
      className={`p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--brand)] transition-colors cursor-pointer ${
        active ? 'border-[var(--brand)] text-[var(--brand)] bg-[var(--brand-50)]' : ''
      } ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
