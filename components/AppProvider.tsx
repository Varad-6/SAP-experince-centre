'use client';

import React from 'react';
import { useGlobalInput } from '@/lib/input';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useGlobalInput();
  return <>{children}</>;
};
