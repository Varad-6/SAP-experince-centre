import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Route & Component Smoke Testing (Clean Fiori Stack)', () => {
  const appDir = path.join(process.cwd(), 'app');
  const componentsDir = path.join(process.cwd(), 'components');

  it('verifies core page files exist and are populated', () => {
    const requiredPages = [
      path.join(appDir, 'page.tsx'),
      path.join(appDir, 'pillars', 'page.tsx'),
      path.join(appDir, 'pillar', '[id]', 'page.tsx'),
      path.join(appDir, 'solution', '[slug]', 'page.tsx'),
      path.join(appDir, 'solution', '[slug]', 'demo', 'page.tsx'),
      path.join(appDir, 'architecture', 'page.tsx'),
      path.join(appDir, 'prerequisites', 'page.tsx'),
      path.join(appDir, 'present', 'page.tsx'),
    ];

    for (const p of requiredPages) {
      expect(fs.existsSync(p), `Page must exist: ${p}`).toBe(true);
      const content = fs.readFileSync(p, 'utf8');
      expect(content.length).toBeGreaterThan(100);
    }
  });

  it('verifies SlideDeck, ContactDialog, BotSprite, and IntroDrop components exist', () => {
    const components = [
      path.join(componentsDir, 'demo', 'SlideDeck.tsx'),
      path.join(componentsDir, 'ContactDialog.tsx'),
      path.join(componentsDir, 'BotSprite.tsx'),
      path.join(componentsDir, 'ThumbnailImage.tsx'),
      path.join(componentsDir, 'IntroDrop.tsx'),
    ];

    for (const c of components) {
      expect(fs.existsSync(c), `Component must exist: ${c}`).toBe(true);
    }
  });

  it('verifies all 12 bot sprite poses exist in public/assets/bot', () => {
    const botDir = path.join(process.cwd(), 'public', 'assets', 'bot');
    const poses = [
      'idle', 'wave', 'present', 'explain', 'think', 'point',
      'alert', 'celebrate', 'thanks', 'laptop', 'fly', 'fall'
    ];

    for (const pose of poses) {
      const p = path.join(botDir, `${pose}.webp`);
      expect(fs.existsSync(p), `Pose must exist: ${pose}.webp`).toBe(true);
    }
  });

  it('verifies zero audio or 3D references in app and components', () => {
    const checkDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
          checkDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          const content = fs.readFileSync(fullPath, 'utf8');
          expect(content).not.toMatch(/from ['"]@\/lib\/audio['"]/);
          expect(content).not.toMatch(/from ['"]@react-three/);
          expect(content).not.toMatch(/from ['"]three['"]/);
        }
      }
    };

    checkDir(appDir);
    checkDir(componentsDir);
  });
});
