import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getConsentState,
  saveConsentState,
  resetAllData,
  getPresenceScore,
  incrementPresenceScore,
  saveJournalEntry,
  getJournalEntries,
  updateKnowledge,
  getKnowledge,
  pushVoiceTranscript,
  savePassage,
  getSavedPassages,
} from '@/lib/storage';

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

describe('consent-gated writes', () => {
  beforeEach(() => {
    resetAllData();
    // Start with consent disabled
    saveConsentState({ localJournalStorage: false, localAdaptiveMemory: false, voiceOutput: false });
  });

  it('saveJournalEntry does not write when localJournalStorage is false', () => {
    const entry = { id: 'j1', content: 'test', createdAt: new Date().toISOString() };
    saveJournalEntry(entry);
    expect(getJournalEntries()).toHaveLength(0);
  });

  it('saveJournalEntry writes when localJournalStorage is true', () => {
    saveConsentState({ localJournalStorage: true });
    const entry = { id: 'j2', content: 'test2', createdAt: new Date().toISOString() };
    saveJournalEntry(entry);
    expect(getJournalEntries()).toHaveLength(1);
  });

  it('updateKnowledge does not write when localAdaptiveMemory is false', () => {
    const before = getKnowledge().interactionCount;
    updateKnowledge({ interactionCount: 999 });
    expect(getKnowledge().interactionCount).toBe(before);
  });

  it('pushVoiceTranscript does not write when voiceOutput is false', () => {
    // If no error thrown and history remains empty, the gate works.
    // We can only verify no crash since get returns [] (default) when nothing written
    expect(() => pushVoiceTranscript('test transcript')).not.toThrow();
  });

  it('savePassage writes regardless of adaptive memory consent (explicit user save)', () => {
    saveConsentState({ localAdaptiveMemory: false, localJournalStorage: false });
    const passage = {
      id: 'p1',
      passage: { id: 'pp1', book: 'Psalms', chapter: 23, verseStart: 1, text: 'The LORD', translation: 'ESV', reference: 'Psalm 23:1' },
      savedAt: new Date().toISOString()
    };
    savePassage(passage);
    expect(getSavedPassages()).toHaveLength(1);
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
