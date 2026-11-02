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
  subtle = false,
  glowColor,
}) => {
  const baseClass = subtle ? 'glass-panel-subtle' : 'glass-panel';
  const glowStyle = glowColor
    ? {
        boxShadow: `0 0 32px color-mix(in srgb, ${glowColor} 25%, transparent), 0 20px 60px rgba(0, 112, 242, 0.15)`,
        borderColor: `color-mix(in srgb, ${glowColor} 30%, rgba(255, 255, 255, 0.14))`,
      }
    : undefined;

  return (
    <div
      className={`${baseClass} transition-all duration-300 ${className}`}
      style={glowStyle}
    >
      {children}
    </div>
  );
};
