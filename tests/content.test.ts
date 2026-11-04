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

  it('validates site.json matches SiteSchema with botName, 3 introLines, and defaultContact', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'site.json'), 'utf8');
    const parsed = SiteSchema.parse(JSON.parse(raw));
    expect(parsed.brand).toBe('Abhiyanta India Solutions');
    expect(parsed.botName).toBe('Aayam');
    expect(parsed.introLines).toHaveLength(3);
    expect(parsed.defaultContact?.email).toBeTruthy();
    expect(parsed.stats.length).toBeGreaterThanOrEqual(4);
  });

  it('validates pillars.json has exactly 4 pillars', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'pillars.json'), 'utf8');
    const pillars = JSON.parse(raw);
    expect(pillars).toHaveLength(4);
    for (const p of pillars) {
      expect(() => PillarSchema.parse(p)).not.toThrow();
    }
  });

  it('validates solutions.json has exactly 28 solutions across 4 pillars', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8');
    const solutions = JSON.parse(raw);
    expect(solutions).toHaveLength(28);
    for (const s of solutions) {
      expect(() => SolutionSummarySchema.parse(s)).not.toThrow();
    }
  });

  it('validates all 28 apps conform to strict 8-card AppContentSchema with basicIntro, contact, closing', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8');
    const solutions = JSON.parse(raw);
    const appsDir = path.join(contentDir, 'apps');

    for (const s of solutions) {
      const appFile = path.join(appsDir, `${s.slug}.json`);
      expect(fs.existsSync(appFile)).toBe(true);
      const appData = JSON.parse(fs.readFileSync(appFile, 'utf8'));
      const parsed = AppContentSchema.parse(appData);
      expect(parsed.cards).toHaveLength(8);
      expect(parsed.basicIntro).toBeTruthy();
      expect(parsed.contact?.email).toBeTruthy();
      expect(parsed.closing?.liveDemoInfo).toBeTruthy();

      parsed.cards.forEach((card) => {
        expect(card.botDialogue.length).toBeGreaterThan(0);
        expect(card.botPose).toBeTruthy();
      });
    }
  });

  it('validates flagship PODZO app has rich production content', () => {
    const podzoFile = path.join(contentDir, 'apps', 'podzo.json');
    const podzo = AppContentSchema.parse(JSON.parse(fs.readFileSync(podzoFile, 'utf8')));
    expect(podzo.hasContent).toBe(true);
    expect(podzo.cards[0].stat?.number).toBe('99.2%');
    expect(podzo.cards[3].hotspots).toHaveLength(4);
    expect(podzo.closing?.liveDemoInfo).toContain('EU30-HANA');
  });
});
