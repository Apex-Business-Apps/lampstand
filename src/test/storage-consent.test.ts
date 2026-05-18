import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getConsentState, saveConsentState, resetAllData, getPresenceScore, incrementPresenceScore } from '@/lib/storage';

describe('consent + presence storage', () => {
  beforeEach(() => resetAllData());

  it('saves and reads consent state idempotently', () => {
    saveConsentState({ microphone: true, voiceOutput: true });
    const state = getConsentState();
    expect(state.microphone).toBe(true);
    expect(state.voiceOutput).toBe(true);
  });

  it('increments presence score safely', () => {
    const before = getPresenceScore();
    incrementPresenceScore(10);
    const after = getPresenceScore();
    expect(after.score).toBeGreaterThan(before.score);
  });

  it('optionalCloudSync defaults to false', () => {
    const state = getConsentState();
    expect(state.optionalCloudSync).toBe(false);
  });
});

describe('cloud sync consent gate', () => {
  beforeEach(() => {
    resetAllData();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('blocks syncProfileToCloud when optionalCloudSync is false', async () => {
    const { syncProfileToCloud } = await import('@/lib/supabaseSync');
    const { supabase } = await import('@/integrations/supabase/client');

    saveConsentState({ optionalCloudSync: false });
    const spy = vi.spyOn(supabase, 'from');

    await syncProfileToCloud('test-user-id');

    expect(spy).not.toHaveBeenCalled();
  });

  it('blocks syncJournalToCloud when optionalCloudSync is false', async () => {
    const { syncJournalToCloud } = await import('@/lib/supabaseSync');
    const { supabase } = await import('@/integrations/supabase/client');

    saveConsentState({ optionalCloudSync: false });
    const spy = vi.spyOn(supabase, 'from');

    await syncJournalToCloud('test-user-id');

    expect(spy).not.toHaveBeenCalled();
  });

  it('blocks syncPassagesToCloud when optionalCloudSync is false', async () => {
    const { syncPassagesToCloud } = await import('@/lib/supabaseSync');
    const { supabase } = await import('@/integrations/supabase/client');

    saveConsentState({ optionalCloudSync: false });
    const spy = vi.spyOn(supabase, 'from');

    await syncPassagesToCloud('test-user-id');

    expect(spy).not.toHaveBeenCalled();
  });
});
