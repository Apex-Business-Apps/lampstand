import { describe, it, expect, beforeEach, vi } from 'vitest';
import { assembleGuidanceContext, formatContextForPrompt } from '@/lib/guidance/contextAssembler';
import { resetFingerprint, recordSignal } from '@/lib/resonance/ResonanceEngine';

// Helpers
function setLocalStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setConsent(overrides: Record<string, unknown> = {}) {
  setLocalStorage('lampstand_consent', {
    localAdaptiveMemory: true,
    localJournalStorage: true,
    optionalCloudSync: false,
    notifications: false,
    microphone: false,
    voiceOutput: false,
    analyticsTelemetry: false,
    accountLinkedPersistence: false,
    updatedAt: new Date().toISOString(),
    ...overrides,
  });
}

const mockPassage = (ref: string) => ({
  id: ref,
  book: 'Psalms',
  chapter: 23,
  verseStart: 1,
  verseEnd: 1,
  text: 'The Lord is my shepherd.',
  translation: 'NABRE',
  reference: ref,
});

beforeEach(() => {
  localStorage.clear();
  resetFingerprint();
});

describe('assembleGuidanceContext', () => {
  it('returns null when localAdaptiveMemory consent is denied', () => {
    setConsent({ localAdaptiveMemory: false });
    const ctx = assembleGuidanceContext();
    expect(ctx).toBeNull();
  });

  it('returns null when no meaningful context exists', () => {
    setConsent();
    // No data, no signals
    const ctx = assembleGuidanceContext();
    expect(ctx).toBeNull();
  });

  it('returns context once saved passages exist', () => {
    setConsent();
    setLocalStorage('lampstand_saved', [
      { id: '1', passage: mockPassage('Psalm 23:1'), savedAt: new Date().toISOString() },
    ]);
    const ctx = assembleGuidanceContext();
    expect(ctx).not.toBeNull();
    expect(ctx!.savedPassageRefs).toContain('Psalm 23:1');
  });

  it('includes up to 3 journal excerpts truncated to 90 chars', () => {
    setConsent();
    const longContent = 'A'.repeat(200);
    setLocalStorage('lampstand_journal', [
      { id: '1', content: longContent, createdAt: new Date().toISOString() },
      { id: '2', content: 'Short entry.', createdAt: new Date().toISOString() },
    ]);
    // Need at least one signal for hasMeaningfulContext
    setLocalStorage('lampstand_saved', [
      { id: '1', passage: mockPassage('John 1:1'), savedAt: new Date().toISOString() },
    ]);
    const ctx = assembleGuidanceContext();
    expect(ctx).not.toBeNull();
    expect(ctx!.recentJournalExcerpts[0].length).toBeLessThanOrEqual(90);
    expect(ctx!.recentJournalExcerpts).toHaveLength(2);
  });

  it('reflects resonance season from recorded signals', () => {
    setConsent();
    // Three distinct struggle themes trigger wilderness (struggle >= 3 in inferSeason).
    // Seven guided signals push sentiment to -0.21 which also qualifies as 'struggling'.
    const themes = ['shame', 'doubt', 'fear', 'grief', 'shame', 'doubt', 'fear'];
    themes.forEach((theme, i) => {
      recordSignal({ signal: 'guided', theme, passage: mockPassage(`S${i}`) });
    });
    setLocalStorage('lampstand_saved', [
      { id: 'p1', passage: mockPassage('Psalm 46:10'), savedAt: new Date().toISOString() },
    ]);
    const ctx = assembleGuidanceContext();
    expect(ctx).not.toBeNull();
    expect(ctx!.resonanceSeason).toBe('wilderness');
    expect(ctx!.sentimentLabel).toBe('struggling');
  });

  it('includes current daily theme from cache', () => {
    setConsent();
    setLocalStorage('lampstand_saved', [
      { id: 'p1', passage: mockPassage('Psalm 1:1'), savedAt: new Date().toISOString() },
    ]);
    setLocalStorage('lampstand_daily_cache', {
      id: 'daily-1',
      date: '2026-05-17',
      theme: 'rest',
      passage: mockPassage('Psalm 23:1'),
      reflection: '',
      prayer: '',
    });
    const ctx = assembleGuidanceContext();
    expect(ctx!.currentDailyTheme).toBe('rest');
  });

  it('caps saved passage refs at 5', () => {
    setConsent();
    const passages = Array.from({ length: 8 }, (_, i) => ({
      id: `p${i}`,
      passage: mockPassage(`Ref ${i}`),
      savedAt: new Date().toISOString(),
    }));
    setLocalStorage('lampstand_saved', passages);
    const ctx = assembleGuidanceContext();
    expect(ctx!.savedPassageRefs.length).toBeLessThanOrEqual(5);
  });
});

describe('formatContextForPrompt', () => {
  it('stays within 600 characters', () => {
    const ctx = {
      resonanceSeason: 'wilderness' as const,
      topThemes: ['fear', 'peace', 'trust'],
      sentimentLabel: 'struggling' as const,
      savedPassageRefs: ['Psalm 23:1', 'John 14:27', 'Romans 8:28', 'Philippians 4:6-7', 'Isaiah 41:10'],
      recentJournalExcerpts: [
        'Feeling overwhelmed by work and struggling to find peace.',
        'Could not sleep again. Praying for rest.',
        'Read the daily passage today. Felt something shift slightly.',
      ],
      currentDailyTheme: 'rest',
      signalCount: 15,
    };
    const formatted = formatContextForPrompt(ctx);
    expect(formatted.length).toBeLessThanOrEqual(600);
  });

  it('includes season description for non-steady season', () => {
    const ctx = {
      resonanceSeason: 'wilderness' as const,
      topThemes: [],
      sentimentLabel: 'steady' as const,
      savedPassageRefs: [],
      recentJournalExcerpts: [],
      currentDailyTheme: '',
      signalCount: 5,
    };
    const formatted = formatContextForPrompt(ctx);
    expect(formatted).toContain('Season:');
    expect(formatted).toContain('struggle or suffering');
  });

  it('omits season line for steady season', () => {
    const ctx = {
      resonanceSeason: 'steady' as const,
      topThemes: ['peace'],
      sentimentLabel: 'steady' as const,
      savedPassageRefs: [],
      recentJournalExcerpts: [],
      currentDailyTheme: '',
      signalCount: 5,
    };
    const formatted = formatContextForPrompt(ctx);
    expect(formatted).not.toContain('Season:');
  });

  it('includes closing instruction to not reveal context', () => {
    const ctx = {
      resonanceSeason: 'steady' as const,
      topThemes: ['peace'],
      sentimentLabel: 'steady' as const,
      savedPassageRefs: ['Psalm 23:1'],
      recentJournalExcerpts: [],
      currentDailyTheme: '',
      signalCount: 3,
    };
    const formatted = formatContextForPrompt(ctx);
    expect(formatted).toContain('do not reference it directly');
  });
});

describe('runtime guidance with context', () => {
  it('assembleGuidanceContext returns null gracefully when localStorage throws', () => {
    // Simulate a broken localStorage
    const originalGetItem = localStorage.getItem.bind(localStorage);
    vi.spyOn(localStorage, 'getItem').mockImplementation((key) => {
      if (key === 'lampstand_consent') throw new Error('storage error');
      return originalGetItem(key);
    });

    const ctx = assembleGuidanceContext();
    expect(ctx).toBeNull();

    vi.restoreAllMocks();
  });
});
