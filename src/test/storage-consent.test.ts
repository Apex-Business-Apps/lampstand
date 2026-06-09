import { describe, it, expect, beforeEach } from 'vitest';
import { getConsentState, saveConsentState, resetAllData, getPresenceScore, incrementPresenceScore } from '@/lib/storage';

describe('consent + presence storage', () => {
  beforeEach(() => resetAllData());

  it('saves and reads consent state idempotently', () => {
    saveConsentState({ microphone: true, voiceOutput: true });
    const state = getConsentState();
    expect(state.microphone).toBe(true);
    expect(state.voiceOutput).toBe(true);
  });

  it('increments presence score safely', () => {
    const before = getPresenceScore();
    incrementPresenceScore(10);
    const after = getPresenceScore();
    expect(after.score).toBeGreaterThan(before.score);
  });
});
