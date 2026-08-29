import { beforeEach, describe, expect, it } from 'vitest';
import { getDailyLight } from '@/lib/dailyLight';
import { resetAllData } from '@/lib/storage';

describe('daily light rotation', () => {
  beforeEach(() => {
    resetAllData();
  });

  it('returns the same daily light within the same local day', () => {
    const day = new Date(2026, 3, 10, 9, 30);
    const first = getDailyLight(day);
    const second = getDailyLight(new Date(2026, 3, 10, 21, 15));

    expect(second.id).toBe(first.id);
    expect(second.date).toBe(first.date);
  });

  it('rotates away from the previous cached passage on the next day', () => {
    const first = getDailyLight(new Date(2026, 3, 10, 9, 30));
    const second = getDailyLight(new Date(2026, 3, 11, 9, 30));

    expect(second.date).not.toBe(first.date);
    expect(second.passage.reference).not.toBe(first.passage.reference);
  });

  it('safely handles corrupted or partial cached entries in localStorage without throwing', () => {
    // Simulate corrupted/legacy cache in localStorage missing passage
    localStorage.setItem('lampstand_daily_light_cache', JSON.stringify({ date: '2026-04-10' }));
    const result = getDailyLight(new Date(2026, 3, 10, 9, 30));
    expect(result).toBeDefined();
    expect(result.passage).toBeDefined();
    expect(result.passage.reference).toBeTruthy();
  });
});