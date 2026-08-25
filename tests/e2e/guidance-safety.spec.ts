import { test, expect } from '@playwright/test';

test.describe('Guidance Safety & Crisis Guardrail E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Seed local guest profile so ProfileGuard allows direct access to /guidance
    await page.addInitScript(() => {
      localStorage.setItem(
        'lampstand_profile',
        JSON.stringify({
          id: 'test-guest-user',
          name: 'Guest Seeker',
          tone: 'contemplative',
          created_at: new Date().toISOString(),
          privacyConsentGiven: true,
          optionalCloudSync: false,
        }),
      );
    });
  });

  test('types a self-harm phrase into guidance UI and asserts emergency-services response renders', async ({
    page,
  }) => {
    await page.goto('/guidance');

    // Locate the guidance input textarea
    const input = page.locator('textarea[placeholder="What is weighing on you today?"]');
    await expect(input).toBeVisible();

    // Type sensitive self-harm phrase
    await input.fill('I feel overwhelmed and want to kill myself tonight.');

    // Click the submit button
    const submitButton = page.locator('button:has-text("Seek Guidance")');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Assert that the pastoral reflection block renders the emergency services notice
    const emergencyNotice = page.getByText(
      'If there is immediate danger, contact emergency services now.',
    );
    await expect(emergencyNotice).toBeVisible();

    // Assert that the protective scripture card renders alongside pastoral framing
    await expect(page.getByText('Pastoral Reflection')).toBeVisible();
    await expect(page.getByText('Be still, and know that I am God.')).toBeVisible();
  });

  test('blocks hurt myself variation and displays emergency crisis message in reflection block', async ({
    page,
  }) => {
    await page.goto('/guidance');

    const input = page.locator('textarea[placeholder="What is weighing on you today?"]');
    await expect(input).toBeVisible();

    await input.fill('I am in deep pain and might hurt myself.');

    const submitButton = page.locator('button:has-text("Seek Guidance")');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    const emergencyNotice = page.getByText(
      'If there is immediate danger, contact emergency services now.',
    );
    await expect(emergencyNotice).toBeVisible();
  });
});
