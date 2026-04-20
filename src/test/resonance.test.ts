import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadFingerprint,
  recordSignal,
  rankCandidates,
  resetFingerprint,
  describeFingerprint,
  pickResonantDaily,
} from '@/lib/resonance/ResonanceEngine';
import type { ScripturePassage } from '@/types';

const p = (id: string, ref: string): ScripturePassage => ({
  id,
  book: 'X', chapter: 1, verseStart: 1, verseEnd: 1,
  text: '...', translation: 'NABRE', reference: ref,
});

describe('ResonanceEngine', () => {
  beforeEach(() => {
    localStorage.clear();
    resetFingerprint();
  });

  it('starts with an empty fingerprint', () => {
    const fp = loadFingerprint();
    expect(fp.signalCount).toBe(0);
    expect(fp.season).toBe('steady');
  });

  it('records signals and accumulates theme affinity', () => {
    recordSignal({ signal: 'saved', theme: 'peace', passage: p('a', 'A 1:1') });
    recordSignal({ signal: 'reflected', theme: 'peace', passage: p('a', 'A 1:1') });
    const fp = loadFingerprint();
    expect(fp.signalCount).toBe(2);
    expect(fp.themeAffinity.peace).toBeGreaterThan(0);
    expect(fp.recentThemes[0]).toBe('peace');
  });

  it('infers wilderness season from struggle themes', () => {
    recordSignal({ signal: 'guided', theme: 'shame', passage: p('a', 'A 1') });
    recordSignal({ signal: 'guided', theme: 'doubt', passage: p('b', 'B 1') });
    recordSignal({ signal: 'guided', theme: 'fear', passage: p('c', 'C 1') });
    const fp = loadFingerprint();
    expect(fp.season).toBe('wilderness');
  });

  it('infers flourishing season from joy/gratitude themes', () => {
    recordSignal({ signal: 'shared', theme: 'gratitude', passage: p('a', 'A') });
    recordSignal({ signal: 'shared', theme: 'joy', passage: p('b', 'B') });
    recordSignal({ signal: 'shared', theme: 'delight', passage: p('c', 'C') });
    const fp = loadFingerprint();
    expect(fp.season).toBe('flourishing');
  });

  it('ranks candidates with strong affinity higher when confidence is high', () => {
    // Build confidence on "peace" theme.
    for (let i = 0; i < 30; i++) {
      recordSignal({ signal: 'saved', theme: 'peace', passage: p(`peace-${i}`, `Ref ${i}`) });
    }
    const ranked = rankCandidates([
      { theme: 'judgment', passage: p('j', 'Judgment 1') },
      { theme: 'peace', passage: p('p', 'Peace 1') },
    ]);
    expect(ranked[0].candidate.theme).toBe('peace');
  });

  it('penalizes recently-shown references via novelty axis', () => {
    recordSignal({ signal: 'saved', theme: 'peace', passage: p('p1', 'Peace 1') });
    const ranked = rankCandidates([
      { theme: 'peace', passage: p('p1', 'Peace 1') },   // just shown
      { theme: 'peace', passage: p('p2', 'Peace 2') },   // novel
    ]);
    // Novel passage should outrank the recently-saved reference.
    expect(ranked[0].candidate.passage.reference).toBe('Peace 2');
  });

  it('lifts consolation themes when the user is struggling', () => {
    // Build wilderness season with struggling sentiment.
    for (let i = 0; i < 5; i++) {
      recordSignal({ signal: 'guided', theme: 'shame', passage: p(`s${i}`, `S ${i}`) });
    }
    const ranked = rankCandidates([
      { theme: 'judgment', passage: p('j', 'J 1') },
      { theme: 'consolation', passage: p('c', 'C 1') },
    ]);
    expect(ranked[0].candidate.theme).toBe('consolation');
    // judgment must score lower (pastoral guardrail)
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });

  it('describeFingerprint returns interpretable diagnostics', () => {
    recordSignal({ signal: 'saved', theme: 'love', passage: p('a', 'A') });
    const desc = describeFingerprint();
    expect(desc.signalCount).toBeGreaterThan(0);
    expect(desc.topThemes).toContain('love');
  });

  it('pickResonantDaily returns null on empty input and a candidate otherwise', () => {
    expect(pickResonantDaily([])).toBeNull();
    const choice = pickResonantDaily([
      { theme: 'peace', passage: p('p', 'Peace 1') },
      { theme: 'love', passage: p('l', 'Love 1') },
    ]);
    expect(choice).not.toBeNull();
    expect(['peace', 'love']).toContain(choice!.theme);
  });

  it('does not mutate during ranking (pure)', () => {
    recordSignal({ signal: 'saved', theme: 'peace', passage: p('a', 'A') });
    const before = JSON.stringify(loadFingerprint());
    rankCandidates([
      { theme: 'fear', passage: p('f', 'Fear') },
      { theme: 'peace', passage: p('p', 'Peace') },
    ]);
    const after = JSON.stringify(loadFingerprint());
    expect(after).toBe(before);
  });
});
