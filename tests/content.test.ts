import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  SiteSchema,
  PillarSchema,
  SolutionSummarySchema,
  AppContentSchema,
} from '../lib/schema';

describe('Content Architecture & Schema Validation', () => {
  const contentDir = path.join(process.cwd(), 'content');

  it('validates site.json matches SiteSchema', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'site.json'), 'utf8');
    const parsed = SiteSchema.parse(JSON.parse(raw));
    expect(parsed.brand).toBe('Abhiyanta India Solutions');
    expect(parsed.stats.length).toBeGreaterThanOrEqual(4);
  });

  it('validates pillars.json has exactly 5 pillars', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'pillars.json'), 'utf8');
    const pillars = JSON.parse(raw);
    expect(pillars).toHaveLength(5);
    for (const p of pillars) {
      expect(() => PillarSchema.parse(p)).not.toThrow();
    }
  });

  it('validates solutions.json has exactly 28 solutions across 5 pillars', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8');
    const solutions = JSON.parse(raw);
    expect(solutions).toHaveLength(28);
    for (const s of solutions) {
      expect(() => SolutionSummarySchema.parse(s)).not.toThrow();
    }
  });

  it('validates all 28 apps conform to strict 8-card AppContentSchema', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8');
    const solutions = JSON.parse(raw);
    const appsDir = path.join(contentDir, 'apps');

    for (const s of solutions) {
      const appFile = path.join(appsDir, `${s.slug}.json`);
      expect(fs.existsSync(appFile)).toBe(true);
      const appData = JSON.parse(fs.readFileSync(appFile, 'utf8'));
      const parsed = AppContentSchema.parse(appData);
      expect(parsed.cards).toHaveLength(8);
    }
  });

  it('validates flagship PODZO app has rich production content', () => {
    const podzoFile = path.join(contentDir, 'apps', 'podzo.json');
    const podzo = AppContentSchema.parse(JSON.parse(fs.readFileSync(podzoFile, 'utf8')));
    expect(podzo.hasContent).toBe(true);
    expect(podzo.cards[0].stat?.number).toBe('99.2%');
    expect(podzo.cards[3].hotspots).toHaveLength(4);
  });
});
