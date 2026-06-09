import { test, expect } from '@playwright/test';
import path from 'path';

test('LampStand visual verification', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Wait for any initial animations
  
  // Take a screenshot of whatever page loaded
  await page.screenshot({ path: path.join(process.cwd(), 'artifacts', 'lampstand-home.png') });

  // If there's an agent presence button, click it to open the FullscreenAgent
  const agentTrigger = await page.$('.agent-presence-trigger, button:has(canvas)');
  if (agentTrigger) {
    await agentTrigger.click();
    // Wait for the fullscreen agent to load
    await page.waitForSelector('text=LampStand', { state: 'visible', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000); // Wait for animations
    await page.screenshot({ path: path.join(process.cwd(), 'artifacts', 'lampstand-fullscreen-agent.png') });
  }
});
