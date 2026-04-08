import { describe, expect, it } from 'vitest';
import { getConsentSettings, saveConsentSettings, resetAllData } from '@/lib/storage';

describe('consent storage', () => {
  it('persists consent toggles and resets cleanly', () => {
    saveConsentSettings({
      localMemory: true,
      notifications: false,
      microphone: true,
      voicePlayback: true,
      cloudSync: false,
      kidsVoiceEnabled: false,
    });
    expect(getConsentSettings().microphone).toBe(true);
    resetAllData();
    expect(getConsentSettings().localMemory).toBe(false);
  });
});
