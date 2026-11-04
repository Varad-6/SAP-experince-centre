import React from 'react';

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
  glowColor?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};
