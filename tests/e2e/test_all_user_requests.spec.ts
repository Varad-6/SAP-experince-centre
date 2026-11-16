import { test, expect } from '@playwright/test';

test.describe('Comprehensive Verification: User Requests Audit v3', () => {
  test('Landing page updates, solution page cleanup, contact modals, and auto-restart intro', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('next-dev')) {
          consoleErrors.push(text);
        }
      }
    });

    // Set desktop executive viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Visit Landing Page
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Verify background image is set to sky_clouds_bg
    const bodyBg = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return style.backgroundImage;
    });
    expect(bodyBg).toContain('sky_clouds_bg');

    // Verify "Contact Architecture Team" is REMOVED from top header
    const topContact = page.locator('text=Contact Architecture Team');
    await expect(topContact).toHaveCount(0);

    // Verify new headline copy
    const expectedCopy =
      'Experience the next generation of enterprise intelligence with SAP BTP, AI, SAP Analytics Cloud, and SAP Business Data Cloud — engineered to transform business processes, data, and decision-making.';
    const heroCopy = page.locator(`text=${expectedCopy}`);
    await expect(heroCopy).toBeVisible();

    // Verify Skip intro button is REMOVED
    const skipBtn = page.getByRole('button', { name: /Skip intro/i });
    await expect(skipBtn).toHaveCount(0);

    // Verify Sound and Replay buttons are REMOVED
    const soundBtn = page.getByRole('button', { name: /Sound:/i });
    await expect(soundBtn).toHaveCount(0);
    const replayBtn = page.getByRole('button', { name: /Replay/i });
    await expect(replayBtn).toHaveCount(0);

    // Capture Act 1 frame to verify mascot colors in browser
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/shots/landing_act1_true_colors.png' });

    // Verify white Contact Details button beside Explore solutions
    const contactBtnLanding = page.getByRole('button', { name: /Contact details/i });
    await expect(contactBtnLanding).toBeVisible();

    // Verify styling: white background, blue text
    const btnBg = await contactBtnLanding.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log('Landing contact button background:', btnBg);
    // rgb(255, 255, 255) is white
    expect(btnBg).toBe('rgb(255, 255, 255)');

    // Click Landing "Contact details" and check that dialog opens
    await contactBtnLanding.click();
    await page.waitForTimeout(400);
    const contactDialog = page.locator('role=dialog');
    await expect(contactDialog).toBeVisible();
    await expect(page.locator('text=Manisha Sawarkar')).toBeVisible();

    // Close contact dialog
    const closeDialogBtn = page.getByRole('button', { name: /Close/i }).or(page.locator('button:has(svg.lucide-x)'));
    await closeDialogBtn.first().click();
    await page.waitForTimeout(300);

    // Capture Landing Page
    await page.screenshot({ path: 'tests/shots/landing_sky_clouds_v3.png' });

    // Test Auto-Restart Intro on reload
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Verify that Act 1 is playing on fresh reload (intro_drop video)
    const act1Video = page.locator('video');
    await expect(act1Video).toBeVisible();
    const videoSrc = await act1Video.getAttribute('src');
    expect(videoSrc).toContain('intro_drop');

    // Verify Skip intro button is NOT present
    await expect(page.getByRole('button', { name: /Skip intro/i })).toHaveCount(0);

    // 2. Navigate to Solution Page
    await page.goto('http://localhost:3000/solution/sap-btp-vibe-coding', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Verify entire bottom action card is REMOVED:
    // "Production-grade Clean Core implementation on SAP BTP." should not exist
    const bottomNote = page.locator('text=Production-grade Clean Core implementation on SAP BTP.');
    await expect(bottomNote).toHaveCount(0);

    // Check top action area:
    // "Interactive demo", "Architecture", and downside of them "Contact details"
    const topDemoBtn = page.getByRole('button', { name: /Interactive demo/i });
    await expect(topDemoBtn).toBeVisible();
    const topArchBtn = page.getByRole('button', { name: /Architecture/i });
    await expect(topArchBtn).toBeVisible();
    const solutionContactBtn = page.getByRole('button', { name: /Contact details/i });
    await expect(solutionContactBtn).toBeVisible();

    // Click solution "Contact details" and check modal opens
    await solutionContactBtn.click();
    await page.waitForTimeout(400);
    await expect(contactDialog).toBeVisible();
    await expect(page.locator('text=Manisha Sawarkar')).toBeVisible();
    await closeDialogBtn.first().click();
    await page.waitForTimeout(300);

    // Capture solution detail page
    await page.screenshot({ path: 'tests/shots/solution_page_cleanup_v3.png' });

    // 3. Navigate into Slide Deck (Interactive Demo)
    await topDemoBtn.click();
    await page.waitForURL('**/solution/sap-btp-vibe-coding/demo');

    // Jump directly to Slide 9
    const slide9Btn = page.getByRole('button', { name: /slide 9/i });
    await expect(slide9Btn).toBeVisible();
    await slide9Btn.click();
    await page.waitForTimeout(500);

    // Verify Slide 9 Terminal
    const terminalHeader = page.locator('text=SAP AI Core Service Key (Masked JSON)');
    await expect(terminalHeader).toBeVisible();

    await page.screenshot({ path: 'tests/shots/slide9_verified_v3.png' });

    // Assert zero console errors
    console.log('Console errors encountered:', consoleErrors);
    expect(consoleErrors.length).toBe(0);
  });
});
