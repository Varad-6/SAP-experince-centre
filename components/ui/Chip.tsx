import React from 'react';

export interface ChipProps {
  label: string;
  variant?: 'sap' | 'cyan' | 'violet' | 'gold' | 'teal' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  className = '',
}) => {
  return (
    <span className={`chip ${className}`}>
      {icon && <span className="w-3.5 h-3.5 mr-1 flex items-center justify-center">{icon}</span>}
      {label}
    </span>
  );
};
