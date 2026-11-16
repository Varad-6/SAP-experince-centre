import { test, expect } from '@playwright/test';

test('Diagnose slide deck navigation with failed requests', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQ FAILED:', req.url(), req.failure()?.errorText));

  await page.goto('/solution/sap-btp-vibe-coding/demo');
  await page.waitForTimeout(1000);

  const nextBtn = page.getByRole('button', { name: /^Next/i });
  console.log('About to click Next...');
  await nextBtn.click();
  await page.waitForTimeout(1000);
});
