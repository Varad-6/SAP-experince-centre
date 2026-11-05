const { chromium } = require('C:/Users/Varad/Documents/GitHub/SAP-experince-centre/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const shotsDir = path.join('C:/Users/Varad/Documents/GitHub/SAP-experince-centre/tests/shots');
  if (!fs.existsSync(shotsDir)) {
    fs.mkdirSync(shotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'msedge' });
  const consoleErrors = [];

  const projects = [
    { slug: 'sap-btp-vibe-coding', name: 'vibe-coding' },
    { slug: 'podzo', name: 'podzo' },
    { slug: 'asset-reliability-mro', name: 'mro' },
  ];

  // 1. Desktop Viewport (1440x900)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(`[Page Error] ${err.message}`);
  });

  for (const proj of projects) {
    console.log(`Navigating to /solution/${proj.slug}/demo ...`);
    await page.goto(`http://localhost:3000/solution/${proj.slug}/demo`, { waitUntil: 'networkidle' });
    // Wait for description fade-in and speech bubble
    await page.waitForTimeout(1500);

    const shot1 = path.join(shotsDir, `${proj.name}-slide1.png`);
    await page.screenshot({ path: shot1 });
    console.log(`Saved screenshot: ${shot1}`);

    // Click next slide
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1500);
      const shot2 = path.join(shotsDir, `${proj.name}-slide2.png`);
      await page.screenshot({ path: shot2 });
      console.log(`Saved screenshot: ${shot2}`);
    }
  }

  // 2. Mobile Viewport (390x844)
  console.log('Testing Mobile Viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/solution/podzo/demo', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);
  const mobileShot = path.join(shotsDir, 'podzo-mobile.png');
  await mobilePage.screenshot({ path: mobileShot });
  console.log(`Saved mobile screenshot: ${mobileShot}`);

  await browser.close();

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`Total Console / Page Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Errors encountered:');
    consoleErrors.forEach(e => console.error(e));
    process.exit(1);
  } else {
    console.log('Zero console errors! All viewports rendered cleanly.');
  }
}

main().catch(err => {
  console.error('Fatal error running screenshot script:', err);
  process.exit(1);
});
