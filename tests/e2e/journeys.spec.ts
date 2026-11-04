import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.beforeAll(() => {
  const shotsDir = path.join(process.cwd(), 'tests', 'shots');
  if (!fs.existsSync(shotsDir)) {
    fs.mkdirSync(shotsDir, { recursive: true });
  }
});

test.describe('AIS Experience Centre User Journeys', () => {
  test('Journey 1: Landing Page, Skip Intro, and Navigate to Pillars', async ({ page }) => {
    await page.goto('/');

    // Check title and branding
    await expect(page.locator('h1')).toContainText(/SAP Enterprise Solutions|Experience Centre/i);

    // Verify Skip intro button exists and click it
    const skipBtn = page.getByRole('button', { name: /Skip intro/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }

    await page.screenshot({ path: 'tests/shots/01_landing_skipped.png' });

    // Click "Explore solutions" CTA
    const exploreBtn = page.getByRole('button', { name: /Explore solutions/i });
    await expect(exploreBtn).toBeVisible();
    await exploreBtn.click();

    // Verify arrived at /pillars
    await expect(page).toHaveURL(/\/pillars/);
    await page.screenshot({ path: 'tests/shots/02_pillars_hub.png' });
  });

  test('Journey 2: Pillars Hub, 5 Cards Grid, and Docked Mascot Guide', async ({ page }) => {
    await page.goto('/pillars');

    // 5 Pillar cards should exist
    const pillarLinks = page.locator('a[href^="/pillar/p"]');
    await expect(pillarLinks).toHaveCount(5);

    // Mascot bot guide should be visible bottom-right
    const botGuide = page.locator('aside');
    await expect(botGuide).toBeVisible();

    await page.screenshot({ path: 'tests/shots/03_pillars_grid.png' });

    // Click on Pillar 1
    await page.locator('a[href="/pillar/p1"]').click();
    await expect(page).toHaveURL('/pillar/p1');
    await page.screenshot({ path: 'tests/shots/04_pillar_detail.png' });
  });

  test('Journey 3: Pillar Detail to Solution Page', async ({ page }) => {
    await page.goto('/pillar/p1');

    // Check project card exists and click PODZO or first solution
    const solutionCard = page.locator('a[href*="/solution/"]').first();
    await expect(solutionCard).toBeVisible();
    await solutionCard.click();

    await expect(page).toHaveURL(/\/solution\/[a-z0-9-]+$/);
    await page.screenshot({ path: 'tests/shots/05_solution_detail.png' });
  });

  test('Journey 4: Solution Detail top actions & mascot hover', async ({ page }) => {
    await page.goto('/solution/podzo');

    // Check 2 buttons top
    const demoBtn = page.getByRole('button', { name: /Interactive demo/i }).first();
    const archBtn = page.getByRole('button', { name: /Architecture/i }).first();

    await expect(demoBtn).toBeVisible();
    await expect(archBtn).toBeVisible();

    // Hover demo button
    await demoBtn.hover();
    await page.screenshot({ path: 'tests/shots/06_podzo_hover_demo.png' });

    // Click demo button to launch SlideDeck
    await demoBtn.click();
    await expect(page).toHaveURL('/solution/podzo/demo');
    await page.screenshot({ path: 'tests/shots/07_podzo_demo_slide1.png' });
  });

  test('Journey 5: SlideDeck 8 Cards & Slide 9 Closing Presentation', async ({ page }) => {
    await page.goto('/solution/podzo/demo');

    // Check slide deck progress indicator
    await expect(page.getByText(/Card 1 of 8/i)).toBeVisible();

    // Click Next button 8 times to walk through all cards to Slide 9
    for (let i = 1; i <= 8; i++) {
      const nextBtn = page.getByRole('button', { name: /Next|Finish/i });
      await nextBtn.click();
      await page.waitForTimeout(200);
    }

    // Verify Closing Slide
    await expect(page.getByText(/Thank You for Exploring/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Demo Contact/i })).toBeVisible();

    await page.screenshot({ path: 'tests/shots/08_podzo_closing_slide.png' });

    // Open Contact Dialog modal
    await page.getByRole('button', { name: /Demo Contact/i }).click();
    await expect(page.getByText(/Lead Enterprise Architect/i)).toBeVisible();
    await page.screenshot({ path: 'tests/shots/09_contact_dialog_modal.png' });
  });
});
