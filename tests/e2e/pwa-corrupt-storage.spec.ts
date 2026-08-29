import { test, expect } from '@playwright/test';

/**
 * Regression shield for the Android PWA "Something went wrong" crash.
 *
 * An installed PWA enters /app directly as a local guest (ProfileGuard's
 * standalone rule), so it is the surface that reads every persisted record on
 * first paint. A single corrupt key used to take the whole tree into the
 * ErrorBoundary while the same build ran fine in a desktop browser, whose
 * store held clean data. Every route must survive a corrupt store.
 */

// Keys a long-lived install reads on app open, with the value that crashed.
const CORRUPT_KEYS = [
  'lampstand_presence_score',
  'lampstand_knowledge',
  'lampstand_consent',
  'lampstand_voice_preferences',
  'lampstand_sync_state',
  'lampstand_auth_state',
  'lampstand_practice_preferences',
];

const ROUTES = ['/app', '/daily', '/saved', '/settings', '/guidance'];

// addInitScript runs in the page, so the key travels as an argument: a closure
// over it would not exist in that context and would seed nothing at all.
function seed(corruptKey: string) {
  localStorage.setItem(
    'lampstand_profile',
    JSON.stringify({
      id: 'test-guest-user',
      firstName: 'Guest',
      onboardingComplete: true,
      toneStyle: 'balanced',
      readingPreference: 'balanced',
      voiceGender: 'male',
    }),
  );
  localStorage.setItem(corruptKey, 'null');
}

test.describe('installed PWA tolerates a corrupt local store', () => {
  for (const key of CORRUPT_KEYS) {
    test(`renders every route with a persisted null in ${key}`, async ({ page, baseURL }) => {
      // The app is offline-first, so the assertion runs with every third-party
      // request blocked: no font or provider host may influence the result.
      const appHost = new URL(baseURL!).host;
      await page.route('**/*', (route) => {
        const { host } = new URL(route.request().url());
        return host === appHost ? route.continue() : route.abort();
      });
      await page.addInitScript(seed, key);

      for (const route of ROUTES) {
        // domcontentloaded, not load: third-party font requests must not decide
        // whether this assertion runs.
        await page.goto(route, { waitUntil: 'domcontentloaded' });

        // The healthy assertion comes first and is the one that waits: AppShell
        // renders <main>, the ErrorBoundary fallback does not. Asserting the
        // absence of the crash text on its own would pass before React mounts.
        await expect(
          page.locator('main'),
          `${route} did not render the app shell with ${key} corrupted`,
        ).toBeVisible();
        await expect(
          page.getByText('Something went wrong'),
          `${route} crashed into the ErrorBoundary with ${key} corrupted`,
        ).toHaveCount(0);
      }
    });
  }
});
