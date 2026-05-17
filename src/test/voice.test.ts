import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveConsentState, saveVoicePreferences } from '@/lib/storage';
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

function mockBrowserTTS() {
  const speak = vi.fn();
  const cancel = vi.fn();
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = { speak, cancel, speaking: false, getVoices: () => [] };
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    rate = 1; pitch = 1;
    onstart?: () => void; onend?: () => void; onerror?: () => void;
    constructor(public text: string) {}
  };
  return { speak, cancel };
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
    const { speak } = mockBrowserTTS();
    const adapter = new TextToSpeechAdapter();
    await adapter.speak('hello world');
    expect(speak).toHaveBeenCalledTimes(1);
  });

  // ── Fix validation: browser TTS works even without voice consent ────────────
  it('plays browser TTS even when voiceOutput consent is false', async () => {
    localStorage.clear();
    saveConsentState({ voiceOutput: false }); // no consent given

    const { speak } = mockBrowserTTS();
    const adapter = new TextToSpeechAdapter();
    await adapter.speak('testing without consent');
    expect(speak).toHaveBeenCalledTimes(1);
  });

  it('is completely silent when voicePref.muted is true', async () => {
    saveVoicePreferences({ muted: true });

    const { speak } = mockBrowserTTS();
    const adapter = new TextToSpeechAdapter();
    await adapter.speak('this should be silent');
    expect(speak).not.toHaveBeenCalled();
  });

  it('falls back to browser TTS when cloud returns a non-ok response', async () => {
    saveConsentState({ voiceOutput: true });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    vi.stubEnv('VITE_SUPABASE_URL', 'https://fake.supabase.co');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'fake-key');

    const { speak } = mockBrowserTTS();
    const adapter = new TextToSpeechAdapter();
    await adapter.speak('cloud failed');
    expect(speak).toHaveBeenCalledTimes(1);
  });
});

describe('intensity-ref fix — no setState on animation frames', () => {
  it('BurningBushCanvas prop type is MutableRefObject not number', async () => {
    // Verify the source no longer accepts a plain `intensity` number prop.
    const src = await import('fs').then(fs =>
      fs.readFileSync('src/components/BurningBushCanvas.tsx', 'utf8')
    );
    expect(src).toContain('intensityRef: React.MutableRefObject<number>');
    expect(src).not.toMatch(/intensity:\s*number/);
  });

  it('FullscreenAgent uses useRef not useState for intensity', async () => {
    const src = await import('fs').then(fs =>
      fs.readFileSync('src/components/FullscreenAgent.tsx', 'utf8')
    );
    expect(src).toContain('intensityRef = useRef');
    expect(src).not.toMatch(/setIntensity\s*\(/);
    expect(src).not.toMatch(/useState\(0\.15\)/);
  });
});

describe('deploy workflow — Groq key wired into build', () => {
  it('deploy workflow passes VITE_GROQ_API_KEY to the build step', async () => {
    const src = await import('fs').then(fs =>
      fs.readFileSync('.github/workflows/deploy-worker-production.yml', 'utf8')
    );
    expect(src).toContain('VITE_GROQ_API_KEY');
    expect(src).toContain('secrets.VITE_GROQ_API_KEY');
  });
});

