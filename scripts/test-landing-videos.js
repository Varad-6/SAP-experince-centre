const { chromium } = require('C:/Users/Varad/Documents/GitHub/SAP-experince-centre/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const shotsDir = path.join('C:/Users/Varad/Documents/GitHub/SAP-experince-centre/tests/shots');
  if (!fs.existsSync(shotsDir)) {
    fs.mkdirSync(shotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'msedge' });
  const consoleErrors = [];

  // Desktop context
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

  // Clear session storage before loading
  await page.addInitScript(() => {
    sessionStorage.clear();
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Verify Act 1 (intro_drop)
  console.log('Testing Act 1 (intro_drop / parachute)...');
  // Wait for bubble to trigger (at 1.8s + typing)
  await page.waitForTimeout(3200);

  const bubble1 = page.locator('[role="status"]');
  const bubble1Text = await bubble1.innerText().catch(() => '');
  console.log(`Act 1 Bubble Text: "${bubble1Text.replace(/\n/g, ' ')}"`);

  // Measure bubble and video rects
  const act1Measurements = await page.evaluate(() => {
    const bubble = document.querySelector('[role="status"]');
    const dots = document.querySelectorAll('[aria-hidden="true"].rounded-full');
    const actor = document.querySelector('.actor');
    return {
      bubbleRect: bubble ? bubble.getBoundingClientRect() : null,
      dotsCount: dots.length,
      actorRect: actor ? actor.getBoundingClientRect() : null,
    };
  });
  console.log('Act 1 Measurements:', JSON.stringify(act1Measurements, null, 2));

  const shotAct1 = path.join(shotsDir, 'landing-act1-parachute.png');
  await page.screenshot({ path: shotAct1 });
  console.log(`Saved screenshot: ${shotAct1}`);

  // 2. Wait for Act 2 (analytics_laptop)
  console.log('Waiting for Act 2 (analytics_laptop / laptop)...');
  // Act 1 runs for ~10s total, wait for transition
  await page.waitForTimeout(8000);

  // Now in Act 2, wait 2.5s for bubble
  await page.waitForTimeout(2500);

  const bubble2 = page.locator('[role="status"]');
  const bubble2Text = await bubble2.innerText().catch(() => '');
  console.log(`Act 2 Bubble Text: "${bubble2Text.replace(/\n/g, ' ')}"`);

  const shotAct2 = path.join(shotsDir, 'landing-act2-laptop.png');
  await page.screenshot({ path: shotAct2 });
  console.log(`Saved screenshot: ${shotAct2}`);

  // 3. Wait for Act 3 (explain_close)
  console.log('Waiting for Act 3 (explain_close / executive greeting)...');
  await page.waitForTimeout(8000);

  // Now in Act 3, wait 2.5s for bubble
  await page.waitForTimeout(2500);

  const bubble3 = page.locator('[role="status"]');
  const bubble3Text = await bubble3.innerText().catch(() => '');
  console.log(`Act 3 Bubble Text: "${bubble3Text.replace(/\n/g, ' ')}"`);

  const shotAct3 = path.join(shotsDir, 'landing-act3-executive.png');
  await page.screenshot({ path: shotAct3 });
  console.log(`Saved screenshot: ${shotAct3}`);

  // 4. Wait for Sequence Completion & Replay button
  console.log('Waiting for sequence completion...');
  await page.waitForTimeout(7000);

  const replayBtn = page.locator('button:has-text("Replay intro")');
  const hasReplay = await replayBtn.isVisible();
  console.log(`Replay button visible: ${hasReplay}`);

  const shotHold = path.join(shotsDir, 'landing-act3-hold.png');
  await page.screenshot({ path: shotHold });
  console.log(`Saved screenshot: ${shotHold}`);

  // 5. Test Replay Click
  if (hasReplay) {
    console.log('Clicking "Replay intro"...');
    await replayBtn.click();
    await page.waitForTimeout(2500);
    const shotReplay = path.join(shotsDir, 'landing-replay-reset.png');
    await page.screenshot({ path: shotReplay });
    console.log(`Saved replay reset screenshot: ${shotReplay}`);
  }

  // 6. Mobile Viewport (390x844)
  console.log('Testing Mobile Viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(3500);
  const shotMobile = path.join(shotsDir, 'landing-mobile.png');
  await mobilePage.screenshot({ path: shotMobile });
  console.log(`Saved mobile screenshot: ${shotMobile}`);

  await browser.close();

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`Total Console / Page Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors logged:');
    consoleErrors.forEach(e => console.error(e));
    process.exit(1);
  } else {
    console.log('Zero console errors! 3-Act video sequence test PASSED.');
  }
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
