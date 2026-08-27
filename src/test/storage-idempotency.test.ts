import { beforeEach, describe, expect, it } from 'vitest';
import { getJournalEntries, getPresenceScore, getSavedPassages, resetAllData, saveJournalEntry, savePassage, savePassages } from '@/lib/storage';
import type { JournalEntry, SavedPassage, ScripturePassage } from '@/types';

const passage: ScripturePassage = {
  id: 'psalm-23-1',
  book: 'Psalm',
  chapter: 23,
  verseStart: 1,
  verseEnd: 1,
  text: 'The LORD is my shepherd.',
  translation: 'NABRE',
  reference: 'Psalm 23:1',
};

function saved(id: string, reference = passage.reference): SavedPassage {
  return { id, passage: { ...passage, reference }, savedAt: '2026-05-07T00:00:00.000Z' };
}

function journal(id: string, content: string): JournalEntry {
  return { id, content, createdAt: '2026-05-07T00:00:00.000Z' };
}

describe('local write idempotency', () => {
  beforeEach(() => resetAllData());

  it('deduplicates saved passages by idempotency reference', () => {
    const before = getPresenceScore().score;
    savePassage(saved('first'));
    savePassage(saved('retry-with-new-id'));

    expect(getSavedPassages()).toHaveLength(1);
    expect(getPresenceScore().score).toBe(before + 3);
  });

  it('deduplicates batch saved passages and remains stable on retry', () => {
    savePassages([saved('one'), saved('two', 'Psalm 46:1'), saved('three', 'Psalm 46:1')]);
    savePassages([saved('one'), saved('two', 'Psalm 46:1')]);

    expect(getSavedPassages().map((entry) => entry.passage.reference).sort()).toEqual(['Psalm 23:1', 'Psalm 46:1']);
  });

  it('updates retried journal writes without duplicating entries', () => {
    const before = getPresenceScore().score;
    saveJournalEntry(journal('entry-1', 'first draft'));
    saveJournalEntry(journal('entry-1', 'edited draft'));
    expect(getJournalEntries()).toEqual([journal('entry-1', 'edited draft')]);
    expect(getPresenceScore().score).toBe(before + 4);
  });

  it('gracefully ignores malformed legacy localStorage entries without crashing', () => {
    localStorage.setItem('lampstand_saved', JSON.stringify([
      { id: 'corrupt-1' },
      { id: 'corrupt-2', passage: null },
      { id: 'corrupt-3', passage: { reference: null } },
      saved('valid-1', 'John 3:16'),
    ]));

    const result = getSavedPassages();
    expect(result).toHaveLength(1);
    expect(result[0].passage.reference).toBe('John 3:16');
  });
});
