import { test, expect } from '@playwright/test';

test.describe('PWA Standalone Startup Invariants', () => {
  test('installed PWA launches directly into core app guest mode without onboarding bounce', async ({ page }) => {
    // Emulate standalone display mode as an installed PWA
    await page.addInitScript(() => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = function (query: string) {
        if (query === '(display-mode: standalone)') {
          return {
            matches: true,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          } as unknown as MediaQueryList;
        }
        return originalMatchMedia.call(window, query);
      };
    });

    // Start with empty storage (clean installation)
    await page.goto('/app', { waitUntil: 'domcontentloaded' });

    // Must render core AppShell (<main>)
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });

    // Must NOT be kicked to onboarding
    expect(page.url()).not.toContain('/onboarding');
    expect(page.url()).toContain('/app');

    // Must render Today's Light hero section
    await expect(page.getByText("Today's Light", { exact: true })).toBeVisible();

    // Must have initialized a local guest profile
    const storedProfile = await page.evaluate(() => localStorage.getItem('lampstand_profile'));
    expect(storedProfile).not.toBeNull();
    const profile = JSON.parse(storedProfile!);
    expect(profile.onboardingComplete).toBe(true);
    expect(profile.firstName).toBe('Seeker');
  });

  test('manifest exposes global origin scope and root application identity', async ({ page, baseURL }) => {
    await page.goto('/');
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestHref).toBe('/manifest.json');

    const res = await page.request.get(new URL(manifestHref!, baseURL).toString());
    expect(res.ok()).toBe(true);
    const manifest = await res.json();

    expect(manifest.id).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.start_url).toBe('/app');
    expect(manifest.display).toBe('standalone');
  });
});
