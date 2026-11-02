'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore, QualityTier } from '@/lib/store';
import { initialQualityAssessment, QUALITY_CONFIGS, QualityConfig, FpsMonitor } from '@/lib/quality';

const QualityContext = createContext<QualityConfig>(QUALITY_CONFIGS.HIGH);

export const useQuality = () => useContext(QualityContext);

export const QualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { quality, setQuality } = useStore();
  const [currentConfig, setCurrentConfig] = useState<QualityConfig>(QUALITY_CONFIGS[quality]);

  useEffect(() => {
    // Initial hardware capability check
    const assessedTier = initialQualityAssessment();
    setQuality(assessedTier);
  }, [setQuality]);

  useEffect(() => {
    setCurrentConfig(QUALITY_CONFIGS[quality]);
  }, [quality]);

  return (
    <QualityContext.Provider value={currentConfig}>
      {children}
    </QualityContext.Provider>
  );
};
