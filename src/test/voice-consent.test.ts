import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getConsent, saveConsent, resetConsent } from '@/lib/consent';

beforeEach(() => {
  localStorage.clear();
});

describe('consent storage', () => {
  it('persists consent toggles', () => {
    const updated = saveConsent({ cloudSync: true, localMemory: true });
    expect(updated.cloudSync).toBe(true);
    expect(getConsent().localMemory).toBe(true);
    resetConsent();
    expect(getConsent().cloudSync).toBe(false);
  });
});

describe('voice adapter import', () => {
  it('exports adapter instances', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const voice = await import('@/lib/voice');
    expect(voice.sttAdapter).toBeDefined();
    expect(voice.ttsAdapter).toBeDefined();
  });
});
