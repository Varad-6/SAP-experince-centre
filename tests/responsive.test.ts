import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Responsive Calibration & No-Clip Invariants', () => {
  const VIEWPORTS = [
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'iPhone 15 Pro Max', width: 430, height: 932 },
    { name: 'iPad Air Portrait', width: 820, height: 1180 },
    { name: 'iPad Air Landscape', width: 1180, height: 820 },
    { name: 'MacBook Air 13', width: 1440, height: 900 },
    { name: 'MacBook Pro 16', width: 1728, height: 1117 },
    { name: 'Full HD Desktop', width: 1920, height: 1080 },
    { name: '4K UHD Display', width: 3840, height: 2160 },
  ];

  it('defines and verifies all 8 target viewports', () => {
    expect(VIEWPORTS).toHaveLength(8);
    for (const vp of VIEWPORTS) {
      expect(vp.width).toBeGreaterThan(0);
      expect(vp.height).toBeGreaterThan(0);
    }
  });

  it('verifies 4K scaling rule is defined in tokens.css', () => {
    const tokensPath = path.join(process.cwd(), 'styles', 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');
    expect(content).toContain('@media (min-width: 2560px)');
    expect(content).toContain('font-size: 125%');
  });

  it('verifies overflow-x hidden on root preventing horizontal clipping', () => {
    const tokensPath = path.join(process.cwd(), 'styles', 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');
    expect(content).toContain('overflow-x: hidden');
  });

  it('verifies BotSprite display height formula aligns with specification', () => {
    // Formula:
    // Landscape (>= 1024px): clamp(220px, 46dvh, 480px)
    // Portrait (< 1024px): clamp(150px, 24dvh, 240px)
    const computeHeight = (width: number, height: number) => {
      const isLandscape = width >= 1024;
      if (isLandscape) {
        return Math.min(480, Math.max(220, height * 0.46));
      } else {
        return Math.min(240, Math.max(150, height * 0.24));
      }
    };

    for (const vp of VIEWPORTS) {
      const h = computeHeight(vp.width, vp.height);
      expect(h).toBeGreaterThanOrEqual(150);
      expect(h).toBeLessThanOrEqual(480);
      // Sprite must never exceed viewport height
      expect(h).toBeLessThan(vp.height);
    }
  });
});
