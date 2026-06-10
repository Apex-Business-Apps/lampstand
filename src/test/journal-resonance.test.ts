import { describe, it, expect, beforeEach, vi } from 'vitest';
import { recordSignal } from '@/lib/resonance/ResonanceEngine';
import { saveJournalEntry, getJournalEntries } from '@/lib/storage';
import type { JournalEntry } from '@/types';

vi.mock('@/lib/resonance/ResonanceEngine', () => ({
  recordSignal: vi.fn(),
  loadFingerprint: vi.fn(() => ({
    themeAffinity: {},
    tonePreference: 'balanced',
    season: 'steady',
    recentRefs: [],
    recentThemes: [],
    sentiment: 0,
    signalCount: 0,
    lastDecayAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
}));

describe('Journal Resonance Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('journal entry supports mood field', () => {
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      content: 'Feeling grateful today',
      mood: 'grateful',
      createdAt: new Date().toISOString(),
    };
    saveJournalEntry(entry);
    const entries = getJournalEntries();
    expect(entries[0].mood).toBe('grateful');
  });

  it('journal entry supports relatedPassage field', () => {
    const passage = {
      id: 'jn-3-16',
      book: 'John',
      chapter: 3,
      verseStart: 16,
      verseEnd: 16,
      text: 'For God so loved the world...',
      translation: 'ESV',
      reference: 'John 3:16',
    };
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      content: 'This verse means everything',
      relatedPassage: passage,
      createdAt: new Date().toISOString(),
    };
    saveJournalEntry(entry);
    const saved = getJournalEntries();
    expect(saved[0].relatedPassage?.reference).toBe('John 3:16');
  });
});
