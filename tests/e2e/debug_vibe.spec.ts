import { test, expect } from '@playwright/test';

test('Verify slide deck advances to slide 2 when clicking next', async ({ page }) => {
  await page.goto('/solution/sap-btp-vibe-coding/demo');
  await page.waitForTimeout(500);

  // Initial check
  await expect(page.getByText('Slide 1 of 10')).toBeVisible();

  // Click Next
  const nextBtn = page.getByRole('button', { name: /^Next/i });
  await nextBtn.click();
  await page.waitForTimeout(500);

  // Verify Slide 2 is active
  await expect(page.getByText('Slide 2 of 10')).toBeVisible();
  console.log('Successfully advanced to Slide 2 of 10!');

  await page.screenshot({ path: 'tests/shots/vibe_slide2_verified.png' });
});
