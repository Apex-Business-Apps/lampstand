import { describe, it, expect } from 'vitest';
import {
  rankCandidates,
  loadFingerprint,
  resetFingerprint,
} from '@/lib/resonance/ResonanceEngine';
import type { ScripturePassage } from '@/types';

/**
 * Locks in the public signature of rankCandidates so future refactors can't
 * silently reintroduce the (candidates, fp, extraArg) mismatch we hit in CI.
 * If this test fails, the call sites in GuidancePage / DailyLightPage / etc.
 * must be updated in the same change.
 */
describe('rankCandidates — signature contract', () => {
  const p = (id: string, ref: string): ScripturePassage => ({
    id,
    book: 'X',
    chapter: 1,
    verseStart: 1,
    verseEnd: 1,
    text: '...',
    translation: 'NABRE',
    reference: ref,
  });

  it('declares no more than two parameters (candidates, optional fingerprint)', () => {
    // Guards against accidentally adding a third positional argument
    // (the exact regression that produced TS2554 in CI).
    expect(rankCandidates.length).toBeLessThanOrEqual(2);
  });

  it('accepts an optional fingerprint override as the second argument', () => {
    localStorage.clear();
    resetFingerprint();
    const fp = loadFingerprint();
    const ranked = rankCandidates(
      [
        { theme: 'peace', passage: p('a', 'A 1') },
        { theme: 'hope', passage: p('b', 'B 1') },
      ],
      fp,
    );
    expect(ranked).toHaveLength(2);
    expect(ranked[0]).toHaveProperty('score');
    expect(ranked[0]).toHaveProperty('candidate');
    expect(ranked[0]).toHaveProperty('axes');
  });

  it('returns candidates sorted by descending score', () => {
    const ranked = rankCandidates([
      { theme: 'peace', passage: p('a', 'A 1') },
      { theme: 'hope', passage: p('b', 'B 1') },
      { theme: 'love', passage: p('c', 'C 1') },
    ]);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score);
    }
  });

  it('is pure on empty input', () => {
    expect(rankCandidates([])).toEqual([]);
  });
});