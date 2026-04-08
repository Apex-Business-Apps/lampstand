import { describe, expect, it, vi } from 'vitest';
import { VoiceOrchestrator } from '@/lib/runtime/voiceOrchestrator';

describe('VoiceOrchestrator', () => {
  it('stops speaking without throwing when silent fallback is used', () => {
    const original = window.speechSynthesis;
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
    const voice = new VoiceOrchestrator();
    expect(() => voice.stopSpeaking()).not.toThrow();
    Object.defineProperty(window, 'speechSynthesis', { value: original, configurable: true });
  });
});
