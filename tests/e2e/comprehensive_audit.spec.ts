import { test, expect } from '@playwright/test';

test('Comprehensive Verification: Landing Page, Audio Controls, Header Removal, and Slide Deck', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // 1. Landing Page Test
  await page.goto('/');
  await page.waitForTimeout(1000);

  // Assert "Abhiyanta" header link does NOT exist at top
  const headerBrand = page.locator('header a:has-text("Abhiyanta")');
  await expect(headerBrand).toHaveCount(0);

  // Verify Sound button exists
  const soundBtn = page.getByRole('button', { name: /Sound:/i });
  await expect(soundBtn).toBeVisible();
  console.log('Sound button is visible with text:', await soundBtn.textContent());

  // Click Sound button to toggle sound ON
  await soundBtn.click();
  await page.waitForTimeout(300);
  console.log('After click, Sound button text:', await soundBtn.textContent());
  await expect(soundBtn).toContainText(/Sound: ON/i);

  // Take screenshot of landing page
  await page.screenshot({ path: 'tests/shots/audit_landing_act1.png' });

  // 2. Navigate to Pillars
  const exploreBtn = page.getByRole('button', { name: /Explore solutions/i });
  await expect(exploreBtn).toBeVisible();
  await exploreBtn.click();
  await expect(page).toHaveURL('/pillars');
  await page.waitForTimeout(500);

  // Assert header does NOT exist on pillars page
  await expect(page.locator('header a:has-text("Abhiyanta")')).toHaveCount(0);
  await page.screenshot({ path: 'tests/shots/audit_pillars.png' });

  // 3. Navigate to SAP BTP Vibe Coding Demo
  await page.goto('/solution/sap-btp-vibe-coding/demo');
  await page.waitForTimeout(1000);

  // Assert header does NOT exist on demo page
  await expect(page.locator('header a:has-text("Abhiyanta")')).toHaveCount(0);

  // Check Slide 1 text
  const descText = await page.locator('.desc').textContent();
  console.log('Slide 1 Description content:', descText);

  // Assert NO raw figure/bot director prompt artifacts
  expect(descText).not.toContain('Figure C1.1');
  expect(descText).not.toContain('ElementTechnical Callout');
  expect(descText).not.toContain('Bot Director Voice:');

  // Verify exactly 2-3 bullets in unordered list
  const bullets = page.locator('.desc ul li');
  const bulletCount = await bullets.count();
  console.log('Slide 1 bullet count:', bulletCount);
  expect(bulletCount).toBeGreaterThanOrEqual(2);
  expect(bulletCount).toBeLessThanOrEqual(3);

  await page.screenshot({ path: 'tests/shots/audit_vibe_slide1.png' });

  // Test Next button click to advance to Slide 2
  const nextBtn = page.getByRole('button', { name: /^Next/i });
  await nextBtn.click();
  await page.waitForTimeout(500);

  await expect(page.getByText('Slide 2 of 10')).toBeVisible();
  await page.screenshot({ path: 'tests/shots/audit_vibe_slide2.png' });

  // Test Next button click to advance to Slide 3
  await nextBtn.click();
  await page.waitForTimeout(500);

  await expect(page.getByText('Slide 3 of 10')).toBeVisible();
  await page.screenshot({ path: 'tests/shots/audit_vibe_slide3.png' });

  // 4. Test PODZO demo navigation as well
  await page.goto('/solution/podzo/demo');
  await page.waitForTimeout(1000);

  await expect(page.getByText('Slide 1 of 8')).toBeVisible();
  const podzoNext = page.getByRole('button', { name: /^Next/i });
  await podzoNext.click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Slide 2 of 8')).toBeVisible();
  await page.screenshot({ path: 'tests/shots/audit_podzo_slide2.png' });

  console.log('Total console errors caught:', consoleErrors.length, consoleErrors);
  expect(consoleErrors.length).toBe(0);
});
