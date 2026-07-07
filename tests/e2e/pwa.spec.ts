import { test, expect } from '@playwright/test';

test.describe('PWA harness', () => {
  test('serves an installable manifest linked from the page', async ({ page, baseURL }) => {
    await page.goto('/');

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestHref).toBe('/manifest.json');

    const res = await page.request.get(new URL(manifestHref!, baseURL).toString());
    expect(res.ok()).toBe(true);
    const manifest = await res.json();
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/app');
    expect(manifest.icons.some((i: { sizes: string }) => i.sizes === '512x512')).toBe(true);
  });

  test('registers a service worker controlling the page', async ({ page }) => {
    await page.goto('/');

    const getScriptURL = () =>
      page.evaluate(async () => {
        const reg = await navigator.serviceWorker.getRegistration();
        return reg?.active?.scriptURL ?? reg?.waiting?.scriptURL ?? reg?.installing?.scriptURL ?? null;
      });

    await expect.poll(getScriptURL, { timeout: 10_000 }).not.toBeNull();
    expect(await getScriptURL()).toContain('/sw.js');
  });

  test('theme-color meta matches the manifest (no drift between the two)', async ({ page, baseURL }) => {
    await page.goto('/');
    const metaThemeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    const manifest = await (await page.request.get(new URL('/manifest.json', baseURL).toString())).json();
    expect(metaThemeColor).toBe(manifest.theme_color);
  });
});
