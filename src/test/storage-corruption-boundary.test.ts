import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAuthState,
  getConsentState,
  getJournalEntries,
  getKnowledge,
  getPracticePreferences,
  getPresenceScore,
  getProfile,
  getSafetyEvents,
  getSavedPassages,
  getSyncState,
  getVoicePreferences,
  resetAllData,
  savePassage,
} from '@/lib/storage';
import type { SavedPassage, ScripturePassage } from '@/types';

/**
 * Regression shield for the Android PWA "Something went wrong" crash.
 *
 * Root cause: the storage read boundary returned a persisted literal `null`
 * instead of the default record, and every caller dereferences these getters
 * directly. One corrupt key took the whole React tree into the ErrorBoundary.
 * localStorage survives app versions and interrupted writes, so no getter may
 * ever hand a caller something that is not the shape it declares.
 */

// Getters that must always return a usable record, never null or undefined.
const RECORD_GETTERS = {
  lampstand_knowledge: getKnowledge,
  lampstand_consent: getConsentState,
  lampstand_presence_score: getPresenceScore,
  lampstand_voice_preferences: getVoicePreferences,
  lampstand_sync_state: getSyncState,
  lampstand_auth_state: getAuthState,
  lampstand_practice_preferences: getPracticePreferences,
} as const;

// Getters that must always return an array.
const LIST_GETTERS = {
  lampstand_saved: getSavedPassages,
  lampstand_journal: getJournalEntries,
  lampstand_safety: getSafetyEvents,
} as const;

// Every way a long-lived install can end up holding a value of the wrong shape.
const CORRUPT_VALUES: Array<[string, string]> = [
  ['persisted null', 'null'],
  ['bare string', '"corrupted"'],
  ['bare number', '42'],
  ['bare boolean', 'true'],
  ['empty string', '""'],
  ['array where a record belongs', '[]'],
  ['record where a list belongs', '{"unexpected":true}'],
  ['truncated json', '{"score":'],
  ['non-json garbage', 'undefined'],
];

describe('storage corruption boundary', () => {
  beforeEach(() => resetAllData());

  for (const [label, raw] of CORRUPT_VALUES) {
    it(`returns a usable record for every record getter given ${label}`, () => {
      for (const [key, read] of Object.entries(RECORD_GETTERS)) {
        localStorage.setItem(key, raw);
        const value = read();
        expect(value, `${key} with ${label}`).not.toBeNull();
        expect(typeof value, `${key} with ${label}`).toBe('object');
        expect(Array.isArray(value), `${key} with ${label}`).toBe(false);
      }
    });

    it(`returns an array for every list getter given ${label}`, () => {
      for (const [key, read] of Object.entries(LIST_GETTERS)) {
        localStorage.setItem(key, raw);
        expect(Array.isArray(read()), `${key} with ${label}`).toBe(true);
      }
    });

    it(`never returns a non-record profile given ${label}`, () => {
      localStorage.setItem('lampstand_profile', raw);
      const profile = getProfile();
      // A missing profile is legitimate and routes to onboarding; a truthy
      // profile must still be a record the pages can read fields off.
      if (profile) expect(typeof profile).toBe('object');
    });
  }

  it('completes a partial legacy record from current defaults', () => {
    localStorage.setItem('lampstand_knowledge', JSON.stringify({ streak: 3 }));
    const knowledge = getKnowledge();

    expect(knowledge.streak).toBe(3);
    expect(knowledge.interactionCount).toBe(0);
    expect(knowledge.frequentTopics).toEqual([]);
    expect(knowledge.preferredReflectionLength).toBe('medium');
  });

  it('repairs an unparseable presence timestamp instead of persisting NaN', () => {
    localStorage.setItem(
      'lampstand_presence_score',
      JSON.stringify({ score: 40, state: 'flame', lastActivityAt: 'not-a-date' }),
    );

    const presence = getPresenceScore();
    expect(Number.isFinite(presence.score)).toBe(true);
    expect(Number.isFinite(new Date(presence.lastActivityAt).getTime())).toBe(true);
  });

  it('does not throw through a render when the store rejects writes', () => {
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
    const entry: SavedPassage = { id: 'quota', passage, savedAt: '2026-05-07T00:00:00.000Z' };

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota exceeded', 'QuotaExceededError');
    });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      expect(() => savePassage(entry)).not.toThrow();
      expect(() => getPresenceScore()).not.toThrow();
    } finally {
      setItem.mockRestore();
      warn.mockRestore();
    }
  });
});
