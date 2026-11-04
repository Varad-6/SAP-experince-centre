const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to landing...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, '../public/snap_landing_act1.png') });

  console.log('Waiting for bubble...');
  await page.waitForTimeout(7000);
  await page.screenshot({ path: path.join(__dirname, '../public/snap_landing_bubble.png') });

  console.log('Navigating to pillars...');
  await page.goto('http://localhost:3000/pillars');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, '../public/snap_pillars.png') });

  console.log('Navigating to podzo demo...');
  await page.goto('http://localhost:3000/solution/podzo/demo');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, '../public/snap_podzo_demo.png') });

  // Slide 4 Live UI of Podzo
  await page.locator('button', { hasText: /^4$/ }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, '../public/snap_podzo_slide4_live.png') });

  await browser.close();
  console.log('Snaps complete!');
})();
