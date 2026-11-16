import { test, expect } from '@playwright/test';

test('Verify 3-Act video progression with transparent characters and thought bubbles', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000); // t = 3s (Act 1 descent)
  await page.screenshot({ path: 'tests/shots/progression_act1_drop.png' });

  // Wait for Act 2 (Laptop)
  await page.waitForTimeout(7500); // advances past 10s into Act 2
  await page.screenshot({ path: 'tests/shots/progression_act2_laptop.png' });

  // Wait for Act 3 (Greeting)
  await page.waitForTimeout(10500); // advances past Act 2 into Act 3
  await page.screenshot({ path: 'tests/shots/progression_act3_greeting.png' });
});
