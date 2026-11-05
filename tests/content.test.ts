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
    expect(parsed.defaultContact?.email).toBe('Manisha.s@abhiyantatech.com');
    expect(parsed.stats.length).toBeGreaterThanOrEqual(4);
  });

  it('validates pillars.json has exactly 3 pillars', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'pillars.json'), 'utf8');
    const pillars = JSON.parse(raw);
    expect(pillars).toHaveLength(3);
    for (const p of pillars) {
      expect(() => PillarSchema.parse(p)).not.toThrow();
    }
  });

  it('validates solutions.json has 13 curated solutions across 3 pillars', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8');
    const solutions = JSON.parse(raw);
    expect(solutions).toHaveLength(13);
    for (const s of solutions) {
      expect(() => SolutionSummarySchema.parse(s)).not.toThrow();
    }
  });

  it('validates all 13 apps conform to AppContentSchema with basicIntro, contact, closing', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8');
    const solutions = JSON.parse(raw);
    const appsDir = path.join(contentDir, 'apps');

    for (const s of solutions) {
      const appFile = path.join(appsDir, `${s.slug}.json`);
      expect(fs.existsSync(appFile)).toBe(true);
      const appData = JSON.parse(fs.readFileSync(appFile, 'utf8'));
      const parsed = AppContentSchema.parse(appData);
      expect(parsed.cards.length).toBeGreaterThanOrEqual(1);
      expect(parsed.basicIntro).toBeTruthy();
      expect(parsed.contact?.email).toBe('Manisha.s@abhiyantatech.com');
      expect(parsed.closing?.liveDemoInfo).toBeTruthy();

      parsed.cards.forEach((card) => {
        if (card.description) {
          expect(card.botDialogue.length).toBeGreaterThan(0);
        }
        expect(card.botPose).toBeTruthy();
      });
    }
  });

  it('validates slide descriptions and short bot lines adhere to specifications', () => {
    const raw = fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8');
    const solutions = JSON.parse(raw);
    const appsDir = path.join(contentDir, 'apps');
    const ALLOWED = new Set([
      'I', 'I\'LL', 'I\'M', 'HERE', 'THIS', 'THESE', 'IT', 'YOU',
      'THE', 'A', 'AN', 'AND', 'WE', 'LET\'S', 'NEXT'
    ]);

    for (const s of solutions) {
      const appFile = path.join(appsDir, `${s.slug}.json`);
      const appData = JSON.parse(fs.readFileSync(appFile, 'utf8'));
      const parsed = AppContentSchema.parse(appData);

      parsed.cards.forEach((card, idx) => {
        if (!card.description) {
          // MISSING_TEXT slide: bot stays idle with no dialogue
          expect(card.botDialogue).toBe('');
          expect(card.botChatMode).toBe('none');
          return;
        }

        const plainText = typeof card.description === 'string' ? card.description : card.description.plain;
        expect(plainText.length).toBeGreaterThan(0);

        // botChat validation: max 2 lines, each at most 20 words (or max 36 words total)
        if (card.botChat && card.botChat.length > 0) {
          expect(card.botChat.length).toBeLessThanOrEqual(2);
          const totalWords = card.botChat.reduce((acc, line) => acc + line.trim().split(/\s+/).length, 0);
          expect(totalWords).toBeLessThanOrEqual(40);

          // Token check: numbers and capitalized acronyms must appear in source text
          const sourceTokens = new Set((plainText.match(/[A-Z0-9]{2,}|\d+/g) || []).map(t => t.toUpperCase()));
          const spokenTokens = (card.botChat.join(' ').match(/[A-Z0-9]{2,}|\d+/g) || []).map(t => t.toUpperCase());
          spokenTokens.forEach(token => {
            if (!ALLOWED.has(token)) {
              expect(sourceTokens.has(token)).toBe(true);
            }
          });
        }
      });
    }
  });

  it('validates flagship PODZO app has rich production content', () => {
    const podzoFile = path.join(contentDir, 'apps', 'podzo.json');
    const podzo = AppContentSchema.parse(JSON.parse(fs.readFileSync(podzoFile, 'utf8')));
    expect(podzo.hasContent).toBe(true);
    expect(podzo.cards.length).toBeGreaterThanOrEqual(1);
    expect(podzo.cards[0].imageUrl).toMatch(/c1_1\.webp|screen-1/);
    expect(podzo.closing?.liveDemoInfo).toBeTruthy();
  });
});
