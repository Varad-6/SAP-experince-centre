'use client';

import React from 'react';
import { GlassPanel } from './GlassPanel';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const icon = {
    success: <CheckCircle2 className="w-4 h-4 text-[#3DDC97]" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#F0AB00]" />,
    info: <Info className="w-4 h-4 text-[#00B8F5]" />,
  }[type];

  return (
    <GlassPanel
      subtle
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 text-sm text-[#EAF2FF] shadow-2xl animate-in slide-in-from-bottom-2"
    >
      {icon}
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-[#9FB3D1] hover:text-white text-xs cursor-pointer"
        >
          ✕
        </button>
      )}
    </GlassPanel>
  );
};
