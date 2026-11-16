import { test, expect } from '@playwright/test';

test('Check landing page', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/shots/landing_initial.png' });
});
