import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/onboarding',
  '/daily',
  '/sermon',
  '/guidance',
  '/kids',
  '/saved',
  '/journal',
  '/settings',
  '/auth',
  '/legal/privacy',
  '/legal/terms',
  '/legal/aup',
  '/legal/disclaimer',
];

test.describe('LampStand mobile route audit', () => {
  for (const route of routes) {
    test(`route renders at mobile width: ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('body')).toBeVisible();
      const overflowWidth = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflowWidth).toBeLessThanOrEqual(1);
    });
  }

  test('captures guidance mobile screenshot', async ({ page }) => {
    await page.goto('/guidance');
    await expect(page.locator('h1')).toContainText('Guidance');
    await page.screenshot({ path: 'artifacts/guidance-mobile.png', fullPage: true });
  });
});
