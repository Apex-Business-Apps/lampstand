import { describe, it, expect, beforeEach } from 'vitest';
import {
  getExamenSteps,
  completeExamen,
  hasCompletedTodayExamen,
  todayExamenSessionId,
  type ExamenResponses,
} from '@/lib/examen/examenFlow';
import { getJournalEntries } from '@/lib/storage';
import type { ToneStyle } from '@/types';

describe('Daily Examen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('produces 5 ordered steps for every tone', () => {
    for (const tone of ['gentle', 'balanced', 'traditional'] as const) {
      const steps = getExamenSteps(tone);
      expect(steps.map((s) => s.id)).toEqual([
        'presence', 'gratitude', 'review', 'sorrow', 'resolve',
      ]);
      for (const s of steps) {
        expect(s.prompt.length).toBeGreaterThan(10);
        expect(s.title.length).toBeGreaterThan(0);
        expect(s.theme.length).toBeGreaterThan(0);
      }
    }
  });

  it('completes idempotently - re-completing same day does not duplicate', () => {
    const responses = {
      presence: 'still',
      gratitude: 'a good meal',
      review: 'long day',
      sorrow: 'lost patience',
      resolve: 'gentler tomorrow',
    };
    completeExamen(responses, 'balanced');
    expect(hasCompletedTodayExamen()).toBe(true);
    completeExamen(responses, 'balanced');
    const entries = getJournalEntries().filter((e) => e.mood === 'examen');
    expect(entries.length).toBe(1);
    expect(entries[0].id).toBe(todayExamenSessionId());
    expect(entries[0].content).toContain('Daily Examen');
    expect(entries[0].content).toContain('a good meal');
  });

  it('skips empty responses without throwing', () => {
    expect(() =>
      completeExamen({ presence: '', gratitude: '', review: '', sorrow: '', resolve: '' }, 'gentle'),
    ).not.toThrow();
    expect(hasCompletedTodayExamen()).toBe(true);
  });

  it('page-level integration: completeExamen writes the session entry that hasCompletedTodayExamen detects', () => {
    const tone: ToneStyle = 'gentle';
    const responses: ExamenResponses = {
      presence: 'still morning',
      gratitude: 'a kind word',
      review: 'busy but present',
      sorrow: 'snapped at someone',
      resolve: 'gentler tomorrow',
    };
    expect(hasCompletedTodayExamen()).toBe(false);
    completeExamen(responses, tone);
    expect(hasCompletedTodayExamen()).toBe(true);
    const entry = getJournalEntries().find((e) => e.mood === 'examen');
    expect(entry).toBeDefined();
    expect(entry!.content).toContain('Daily Examen');
  });
});
