import { test, expect } from '@playwright/test';

test('Inspect video and canvas on landing page', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);

  const videoTag = page.locator('.actor video');
  const canvasTag = page.locator('.actor canvas');
  const imgTag = page.locator('.actor img');

  console.log('Video count:', await videoTag.count());
  console.log('Canvas count:', await canvasTag.count());
  console.log('Img count:', await imgTag.count());

  if (await videoTag.count() > 0) {
    const vInfo = await videoTag.first().evaluate((v: HTMLVideoElement) => ({
      src: v.currentSrc || v.src,
      paused: v.paused,
      currentTime: v.currentTime,
      readyState: v.readyState,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      className: v.className,
    }));
    console.log('Video Info:', vInfo);
  }

  if (await canvasTag.count() > 0) {
    const cInfo = await canvasTag.first().evaluate((c: HTMLCanvasElement) => ({
      width: c.width,
      height: c.height,
      className: c.className,
    }));
    console.log('Canvas Info:', cInfo);
  }
});
