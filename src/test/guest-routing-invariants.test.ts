import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('guest routing invariants', () => {
  it('does not send web guest CTAs to the legacy /lite agent page', () => {
    const authPage = fs.readFileSync('src/pages/AuthPage.tsx', 'utf8');
    const marketingPage = fs.readFileSync('src/pages/MarketingPage.tsx', 'utf8');
    const entryPage = fs.readFileSync('src/pages/EntryPage.tsx', 'utf8');

    expect(authPage).toContain("navigate('/onboarding')");
    expect(marketingPage).toContain('navigate("/onboarding")');
    expect(entryPage).toContain('navigate("/onboarding", { replace: true })');
    expect(authPage).not.toContain('/lite?source=web');
    expect(marketingPage).not.toContain('/lite?source=web');
    expect(entryPage).not.toContain('navigate("/lite"');
  });

  it('keeps /lite as a redirect alias, not a full-page Burning Bush agent', () => {
    const litePage = fs.readFileSync('src/pages/LiteLandingPage.tsx', 'utf8');

    expect(litePage).toContain('<Navigate to={target} replace />');
    expect(litePage).not.toContain('FullscreenAgent');
    expect(litePage).not.toContain('setAgentOpen');
  });

  it('documents that /lite must never render the full-page agent', () => {
    const routingRules = fs.readFileSync('docs/ROUTING_RULES.md', 'utf8');

    expect(routingRules).toContain('Legacy alias only');
    expect(routingRules).toContain('MUST NOT import or render `FullscreenAgent`');
  });
});
