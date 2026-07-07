import { describe, expect, it, afterEach } from 'vitest';
import fs from 'node:fs';
import { isStandaloneDisplayMode } from '@/lib/pwa/standalone';

describe('isStandaloneDisplayMode', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    delete (window.navigator as unknown as { standalone?: boolean }).standalone;
  });

  function mockMatchMedia(matches: boolean) {
    window.matchMedia = ((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  it('is true when display-mode: standalone matches (Android/desktop installed PWA)', () => {
    mockMatchMedia(true);
    expect(isStandaloneDisplayMode()).toBe(true);
  });

  it('is true when navigator.standalone is set (iOS home-screen app)', () => {
    mockMatchMedia(false);
    (window.navigator as unknown as { standalone?: boolean }).standalone = true;
    expect(isStandaloneDisplayMode()).toBe(true);
  });

  it('is false in an ordinary browser tab', () => {
    mockMatchMedia(false);
    expect(isStandaloneDisplayMode()).toBe(false);
  });
});

describe('installed-app routing invariant (no duplicate detectors)', () => {
  // EntryPage and ProfileGuard both gate a "MUST go straight into the app"
  // routing rule on standalone detection. Two of these previously carried
  // their own copy-pasted implementation instead of the shared helper,
  // which meant a fix to one would not apply to the other. Guard against
  // that drift coming back.
  const consumers = [
    'src/pages/EntryPage.tsx',
    'src/components/ProfileGuard.tsx',
    'src/lib/notifications/dailyReminder.ts',
  ];

  it.each(consumers)('%s imports the shared detector instead of redefining it', (file) => {
    const src = fs.readFileSync(file, 'utf8');
    expect(src).toContain('@/lib/pwa/standalone');
    expect(src).not.toMatch(/function\s+isStandaloneDisplayMode\s*\(/);
  });
});
