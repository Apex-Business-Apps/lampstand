import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveConsentState } from '@/lib/storage';
import { SpeechToTextAdapter, TextToSpeechAdapter } from '@/lib/voice';

class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  maxAlternatives = 1;
  lang = 'en-US';
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  onend: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn();
  abort = vi.fn();
}

describe('voice adapters', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    saveConsentState({ microphone: true, voiceOutput: true });
  });

  it('surfaces STT permission errors instead of swallowing provider failures', async () => {
    const recognition = new MockSpeechRecognition();
    recognition.start.mockImplementation(() => recognition.onerror?.({ error: 'not-allowed' }));
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = vi.fn(() => recognition);

    const adapter = new SpeechToTextAdapter();
    await expect(adapter.startListening()).rejects.toThrow('Microphone access denied');
  });

  it('rejects STT sessions that end without transcript', async () => {
    const recognition = new MockSpeechRecognition();
    recognition.start.mockImplementation(() => recognition.onend?.());
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = vi.fn(() => recognition);

    const adapter = new SpeechToTextAdapter();
    await expect(adapter.startListening()).rejects.toThrow('No speech detected');
  });

  it('allows first-run TTS playback when consent exists and prefs are not persisted yet', async () => {
    const speak = vi.fn();
    const cancel = vi.fn();
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = { speak, cancel, speaking: false, getVoices: () => [] };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      rate = 1;
      pitch = 1;
      onstart?: () => void;
      onend?: () => void;
      onerror?: () => void;
      constructor(public text: string) {}
    };

    const adapter = new TextToSpeechAdapter();
    await adapter.speak('hello world');
    expect(speak).toHaveBeenCalledTimes(1);
  });
});
