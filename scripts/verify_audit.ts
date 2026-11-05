import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = path.join(process.cwd(), 'tests', 'shots', 'content-audit');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function runAudit() {
  console.log('Starting Playwright Content & Visual Audit...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'laptop', width: 1280, height: 800 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  const testProjects = [
    { slug: 'sap-btp-vibe-coding', name: 'SAP BTP Vibe Coding' },
    { slug: 'podzo', name: 'PODZO' },
    { slug: 'reconly', name: 'RECONLY' },
    { slug: 'hanamorph', name: 'HanaMorph' },
    { slug: 'asset-reliability-mro', name: 'Asset Reliability MRO' },
  ];

  let totalErrors = 0;

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    const consoleErrors: string[] = [];
    page.on('response', (res) => {
      if (res.status() === 404) {
        console.warn(`404 detected: ${res.url()}`);
      }
    });

    page.on('requestfailed', (req) => {
      console.warn(`REQUEST FAILED: ${req.url()} - ${req.failure()?.errorText}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        const url = msg.location()?.url || '';
        if (!text.includes('favicon') && !url.includes('favicon')) {
          console.warn(`BROWSER ERROR [${url}]: ${text}`);
          consoleErrors.push(text);
        }
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    // Test Landing Page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}_landing.png`) });

    // Test Pillars Overview
    await page.goto('http://localhost:3000/pillars', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}_pillars.png`) });

    // Test each test project
    for (const proj of testProjects) {
      // 1. Project Detail Page
      await page.goto(`http://localhost:3000/solution/${proj.slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}_${proj.slug}_overview.png`) });

      // 2. Interactive Demo Slide 1
      await page.goto(`http://localhost:3000/solution/${proj.slug}/demo`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}_${proj.slug}_slide1.png`) });

      // Check image in slide 1
      const slide1ImgSrc = await page.locator('img[alt]').first().getAttribute('src').catch(() => null);
      if (proj.slug !== 'podzo' && slide1ImgSrc && slide1ImgSrc.includes('podzo')) {
        console.error(`FAIL: Project ${proj.slug} Slide 1 contains PODZO image: ${slide1ImgSrc}`);
        totalErrors++;
      } else {
        console.log(`✓ ${proj.slug} Slide 1 image: ${slide1ImgSrc || 'no-image'}`);
      }

      // 3. Navigate to Slide 5
      if (vp.name === 'mobile') {
        const nextBtn = page.locator('button', { hasText: 'Next' }).first();
        for (let i = 0; i < 4; i++) {
          if (await nextBtn.isVisible()) {
            await nextBtn.click();
            await page.waitForTimeout(200);
          }
        }
      } else {
        const pill5 = page.locator('button[aria-label="Jump to slide 5"]');
        if ((await pill5.count()) > 0 && (await pill5.first().isVisible())) {
          await pill5.first().click();
        }
      }
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}_${proj.slug}_slide5.png`) });

      const slide5ImgSrc = await page.locator('img[alt]').first().getAttribute('src').catch(() => null);
      if (proj.slug !== 'podzo' && slide5ImgSrc && slide5ImgSrc.includes('podzo')) {
        console.error(`FAIL: Project ${proj.slug} Slide 5 contains PODZO image: ${slide5ImgSrc}`);
        totalErrors++;
      } else {
        console.log(`✓ ${proj.slug} Slide 5 image: ${slide5ImgSrc || 'full-width text'}`);
      }
    }

    if (consoleErrors.length > 0) {
      console.error(`Console errors on viewport ${vp.name}:`, consoleErrors);
      totalErrors += consoleErrors.length;
    } else {
      console.log(`✓ Viewport ${vp.name}: 0 console errors.`);
    }

    await context.close();
  }

  await browser.close();

  if (totalErrors === 0) {
    console.log('\n===============================================');
    console.log('AUDIT PASSED PERFECTLY WITH ZERO ERRORS!');
    console.log(`Screenshots saved to: ${OUT_DIR}`);
    console.log('===============================================\n');
    process.exit(0);
  } else {
    console.error(`\nAudit completed with ${totalErrors} failures/errors.`);
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
