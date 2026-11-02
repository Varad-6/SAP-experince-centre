import React from 'react';

export interface ChipProps {
  label: string;
  variant?: 'sap' | 'cyan' | 'violet' | 'gold' | 'teal' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'neutral',
  icon,
  className = '',
}) => {
  const variantStyles = {
    sap: 'bg-[#0070F2]/15 text-[#0070F2] border-[#0070F2]/30',
    cyan: 'bg-[#00B8F5]/15 text-[#00B8F5] border-[#00B8F5]/30',
    violet: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30',
    gold: 'bg-[#F0AB00]/15 text-[#F0AB00] border-[#F0AB00]/30',
    teal: 'bg-[#19C3A6]/15 text-[#19C3A6] border-[#19C3A6]/30',
    neutral: 'bg-white/5 text-[#9FB3D1] border-white/10',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border backdrop-blur-sm tracking-wide ${variantStyles} ${className}`}
    >
      {icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>}
      {label}
    </span>
  );
};
