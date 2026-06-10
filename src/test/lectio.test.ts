import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLectioSteps,
  completeLectio,
  hasCompletedTodayLectio,
  todayLectioSessionId,
  type LectioResponses,
} from '@/lib/lectio/lectioFlow';
import { getJournalEntries } from '@/lib/storage';
import type { ScripturePassage, ToneStyle } from '@/types';

const PASSAGE: ScripturePassage = {
  id: 'jn-14-1',
  book: 'John',
  chapter: 14,
  verseStart: 1,
  verseEnd: 4,
  text: 'Let not your hearts be troubled. Believe in God; believe also in me.',
  translation: 'ESV',
  reference: 'John 14:1-4',
};

describe('Lectio Divina', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('produces 4 ordered movements for every tone', () => {
    for (const tone of ['gentle', 'balanced', 'traditional'] as const) {
      const steps = getLectioSteps(tone);
      expect(steps.map((s) => s.id)).toEqual(['lectio', 'meditatio', 'oratio', 'contemplatio']);
      for (const s of steps) {
        expect(s.prompt.length).toBeGreaterThan(10);
        expect(s.title.length).toBeGreaterThan(0);
        expect(s.latin.length).toBeGreaterThan(0);
        expect(s.theme.length).toBeGreaterThan(0);
      }
    }
  });

  it('completes idempotently — re-completing same day does not duplicate', () => {
    const responses = {
      lectio: 'Let not your hearts be troubled',
      meditatio: 'I notice my anxiety',
      oratio: 'Lord, steady me',
      contemplatio: 'peace',
    };
    completeLectio(responses, PASSAGE, 'balanced');
    expect(hasCompletedTodayLectio()).toBe(true);
    completeLectio(responses, PASSAGE, 'balanced');
    const entries = getJournalEntries().filter((e) => e.mood === 'lectio');
    expect(entries.length).toBe(1);
    expect(entries[0].id).toBe(todayLectioSessionId());
    expect(entries[0].content).toContain('Lectio Divina');
    expect(entries[0].content).toContain('John 14:1-4');
    expect(entries[0].relatedPassage?.reference).toBe('John 14:1-4');
  });

  it('skips empty responses without throwing', () => {
    expect(() =>
      completeLectio({ lectio: '', meditatio: '', oratio: '', contemplatio: '' }, PASSAGE, 'gentle'),
    ).not.toThrow();
    expect(hasCompletedTodayLectio()).toBe(true);
  });

  it('page-level integration: completeLectio writes entry that hasCompletedTodayLectio detects and includes relatedPassage', () => {
    const tone: ToneStyle = 'balanced';
    const responses: LectioResponses = {
      lectio: 'Let not your hearts be troubled',
      meditatio: 'I feel the invitation to trust',
      oratio: 'Lord, steady me today',
      contemplatio: 'A deep quiet',
    };
    expect(hasCompletedTodayLectio()).toBe(false);
    completeLectio(responses, PASSAGE, tone);
    expect(hasCompletedTodayLectio()).toBe(true);
    const entry = getJournalEntries().find((e) => e.mood === 'lectio');
    expect(entry).toBeDefined();
    expect(entry!.relatedPassage?.reference).toBe(PASSAGE.reference);
    expect(entry!.content).toContain('Lectio Divina');
  });
});