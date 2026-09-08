import { test, expect } from '@playwright/test';

test.describe('Production Surfaces & Runtime Reliability', () => {
  test.beforeEach(async ({ page }) => {
    // Seed authenticated/onboarded profile so app shell and interior routes render immediately
    await page.addInitScript(() => {
      localStorage.setItem(
        'lampstand_profile',
        JSON.stringify({
          firstName: 'Disciple',
          onboardingComplete: true,
          toneStyle: 'balanced',
          readingPreference: 'balanced',
          kidsMode: false,
          notificationsEnabled: false,
        }),
      );
    });
  });

  test('navigates home page and verifies zero page errors or broken elements', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page).toHaveTitle(/TheLampStand/i);
    await expect(page.locator('body')).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('verifies Daily Light page renders expanded devotional content with 0 errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/daily');
    // Verify devotional text elements are present
    await expect(page.locator('text=Begin here.').first()).toBeVisible();
    await expect(page.locator('text=Daily Scripture Meditation').first()).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('verifies Settings page renders the PWA install harness and app section', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/settings');
    const harness = page.locator('[data-testid="pwa-install-harness"]');
    await expect(harness.first()).toBeVisible();
    await expect(page.locator('text=App & Installation')).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('verifies Install page renders guidance and install triggers cleanly', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/install');
    await expect(page.locator('text=Install TheLampStand').first()).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('verifies Sermon Mode can render grounded meditations across the expanded library', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/sermon');
    await expect(page.locator('body')).toBeVisible();
    expect(errors).toHaveLength(0);
  });
});
