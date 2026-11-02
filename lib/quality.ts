import { QualityTier } from './store';
import { detectDevice } from './device';

export interface QualityConfig {
  tier: QualityTier;
  dpr: number;
  particles: number;
  bloom: boolean;
  vignette: boolean;
  chromaticAberration: boolean;
  shadows: 'soft' | 'blob' | 'none';
  envResolution: number;
  maxTextureSize: number;
}

export const QUALITY_CONFIGS: Record<QualityTier, QualityConfig> = {
  HIGH: {
    tier: 'HIGH',
    dpr: 2,
    particles: 2000,
    bloom: true,
    vignette: true,
    chromaticAberration: true,
    shadows: 'soft',
    envResolution: 4096,
    maxTextureSize: 4096,
  },
  MED: {
    tier: 'MED',
    dpr: 1.5,
    particles: 800,
    bloom: true,
    vignette: false,
    chromaticAberration: false,
    shadows: 'blob',
    envResolution: 2048,
    maxTextureSize: 2048,
  },
  LOW: {
    tier: 'LOW',
    dpr: 1,
    particles: 250,
    bloom: false,
    vignette: false,
    chromaticAberration: false,
    shadows: 'none',
    envResolution: 1024,
    maxTextureSize: 1024,
  },
};

export function initialQualityAssessment(): QualityTier {
  if (typeof window === 'undefined') return 'HIGH';
  const caps = detectDevice();

  if (caps.isBigScreen) return 'HIGH';
  if (caps.cores <= 2 || caps.memoryGb <= 4) return 'LOW';
  if (caps.cores <= 4 || caps.memoryGb <= 6) return 'MED';
  return 'HIGH';
}

export class FpsMonitor {
  private frames = 0;
  private lastTime = performance.now();
  private samples: number[] = [];
  private onDowngrade?: (newTier: QualityTier) => void;
  private currentTier: QualityTier = 'HIGH';

  constructor(currentTier: QualityTier, onDowngrade?: (newTier: QualityTier) => void) {
    this.currentTier = currentTier;
    this.onDowngrade = onDowngrade;
  }

  tick() {
    this.frames++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 1000) {
      const fps = (this.frames * 1000) / elapsed;
      this.samples.push(fps);
      if (this.samples.length > 3) this.samples.shift();

      if (this.samples.length === 3) {
        const avgFps = this.samples.reduce((a, b) => a + b, 0) / 3;
        if (avgFps < 40) {
          if (this.currentTier === 'HIGH') {
            this.currentTier = 'MED';
            this.onDowngrade?.('MED');
          } else if (this.currentTier === 'MED') {
            this.currentTier = 'LOW';
            this.onDowngrade?.('LOW');
          }
          this.samples = []; // Reset after downgrade
        }
      }

      this.frames = 0;
      this.lastTime = now;
    }
  }
}
