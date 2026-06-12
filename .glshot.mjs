import { chromium } from '@playwright/test';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.addInitScript(() => localStorage.setItem('lampstand_consent_given', 'true'));
await page.goto('http://127.0.0.1:5180/welcome', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
await page.screenshot({ path: '/tmp/gl-hero.png' });
await page.screenshot({ path: '/tmp/gl-lamp.png', clip: { x: 860, y: 120, width: 540, height: 480 } });
// glide the light over the center to reveal cross + scripture
await page.mouse.move(700, 300);
await page.waitForTimeout(300);
await page.mouse.move(720, 420);
await page.waitForTimeout(1600);
await page.screenshot({ path: '/tmp/gl-veil-cross.png', clip: { x: 380, y: 60, width: 700, height: 700 } });
await browser.close();
console.log('done');
