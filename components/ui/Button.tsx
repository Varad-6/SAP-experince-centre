'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
  const sizeClass = size === 'sm' ? '!h-9 !px-3.5 !text-xs' : size === 'lg' ? '!h-12 !px-6 !text-base' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
