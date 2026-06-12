import { chromium } from '@playwright/test';
import * as fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  // Wait for dev server to be ready
  let connected = false;
  for (let i = 0; i < 20; i++) {
    try {
      await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 5000 });
      connected = true;
      break;
    } catch (e) {
      console.log(`Waiting for dev server... (attempt ${i + 1})`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!connected) {
    console.error('Could not connect to dev server on port 5173');
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(1000); // Allow animations to settle
    await page.screenshot({ path: `screenshots/${vp.name}.png`, fullPage: true });
    console.log(`Saved screenshots/${vp.name}.png`);
  }

  await browser.close();
})();
