const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const VIEWPORTS = [
  { name: '390x844', w: 390, h: 844 },
  { name: '820x1180', w: 820, h: 1180 },
  { name: '1440x900', w: 1440, h: 900 },
  { name: '1920x1080', w: 1920, h: 1080 },
  { name: '3840x2160', w: 3840, h: 2160 },
];

const SHOTS_DIR = path.join(__dirname, '..', 'tests', 'shots');
if (!fs.existsSync(SHOTS_DIR)) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

(async () => {
  console.log('Starting bubble verification across 5 viewports...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting viewport ${vp.name} (${vp.w}x${vp.h})...`);
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: vp.w >= 3840 ? 1 : 1,
    });

    // 1. Landing Page Test
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const landingShot = path.join(SHOTS_DIR, `bubble-${vp.name}-landing.png`);
    await page.screenshot({ path: landingShot });
    console.log(`  Saved ${landingShot}`);

    // 2. Demo Slide 1 Test
    await page.goto('http://localhost:3000/solution/podzo/demo', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const bubbleEl = await page.locator('[role="status"]');
    const isVisible = await bubbleEl.isVisible().catch(() => false);
    if (isVisible) {
      const bBox = await bubbleEl.boundingBox();
      console.log(`  Demo Bubble Box: top=${Math.round(bBox.y)}, left=${Math.round(bBox.x)}, w=${Math.round(bBox.width)}, h=${Math.round(bBox.height)}`);
    }

    const demoShot = path.join(SHOTS_DIR, `bubble-${vp.name}-demo-slide1.png`);
    await page.screenshot({ path: demoShot });
    console.log(`  Saved ${demoShot}`);

    await page.close();
  }

  await browser.close();
  console.log('\nAll viewport tests and screenshots completed successfully!');
})();
