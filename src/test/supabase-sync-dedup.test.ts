import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { resetAllData, saveConsentState, getSavedPassages, getJournalEntries } from '@/lib/storage';
import type { SavedPassage, JournalEntry } from '@/types';

describe('cloud sync deduplication', () => {
  beforeEach(() => {
    resetAllData();
    saveConsentState({ optionalCloudSync: true });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('syncPassagesToCloud includes id field to prevent duplicate rows', async () => {
    const { syncPassagesToCloud } = await import('@/lib/supabaseSync');
    const { supabase } = await import('@/integrations/supabase/client');

    const passage: SavedPassage = {
      id: 'test-passage-id-1',
      passage: { id: 'p1', book: 'Psalms', chapter: 23, verseStart: 1, text: 'The LORD is my shepherd', translation: 'ESV', reference: 'Psalm 23:1' },
      savedAt: new Date().toISOString(),
    };

    const upsertMock = vi.fn().mockReturnValue({ error: null });
    vi.spyOn(supabase, 'from').mockReturnValue({ upsert: upsertMock } as unknown as ReturnType<typeof supabase.from>);

    // Inject the passage into local storage so sync picks it up
    const { savePassage } = await import('@/lib/storage');
    savePassage(passage);

    await syncPassagesToCloud('user-123');

    expect(upsertMock).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'test-passage-id-1' })]),
      expect.any(Object)
    );
  });

  it('syncJournalToCloud includes id and created_at to prevent duplicate rows', async () => {
    const { syncJournalToCloud } = await import('@/lib/supabaseSync');
    const { supabase } = await import('@/integrations/supabase/client');
    const { saveJournalEntry } = await import('@/lib/storage');

    const entry: JournalEntry = {
      id: 'test-journal-id-1',
      content: 'Test journal entry',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    const upsertMock = vi.fn().mockReturnValue({ error: null });
    vi.spyOn(supabase, 'from').mockReturnValue({ upsert: upsertMock } as unknown as ReturnType<typeof supabase.from>);

    saveJournalEntry(entry);
    await syncJournalToCloud('user-123');

    expect(upsertMock).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'test-journal-id-1', created_at: '2026-01-01T00:00:00.000Z' })]),
      expect.any(Object)
    );
  });
});
