import { audioAnalyzer } from '@/lib/audioAnalyzer';
import { getConsentState, getVoicePreferences, pushVoiceTranscript } from '@/lib/storage';

export type VoiceGender = 'male' | 'female';

export interface SpeechToTextProvider {
  isSupported(): boolean;
  startListening(): Promise<string>;
  stopListening(): void;
}

class BrowserSpeechToTextProvider implements SpeechToTextProvider {
  private recognition: {
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    start: () => void;
    stop: () => void;
  } | null = null;

  constructor() {
    const speechWindow = window as Window & {
      webkitSpeechRecognition?: new () => BrowserSpeechToTextProvider['recognition'];
      SpeechRecognition?: new () => BrowserSpeechToTextProvider['recognition'];
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = false;
        this.recognition = recognition;
      }
    }
  }

  isSupported() { return this.recognition !== null; }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }
      this.recognition.onresult = (event) => resolve(event.results[0][0].transcript);
      this.recognition.onerror = (event) => reject(new Error(event.error));
      this.recognition.start();
    });
  }

  stopListening() {
    this.recognition?.stop();
  }
}

class NullSpeechToTextProvider implements SpeechToTextProvider {
  isSupported() {
    return true;
  }

  async startListening() {
    return '';
  }

  stopListening() {
    // Explicit no-op fallback.
  }

export class SpeechToTextAdapter {
  private providers: SpeechToTextProvider[] = [new BrowserSpeechToTextProvider(), new NullSpeechToTextProvider()];
  private activeProvider: SpeechToTextProvider | null = null;

  isSupported() {
    return this.providers.some((p) => p.isSupported());
  }

  async startListening(): Promise<string> {
    const consent = getConsentState();
    if (!consent.microphone) throw new Error('Microphone consent is required in settings');

    for (const provider of this.providers) {
      if (!provider.isSupported()) continue;
      this.activeProvider = provider;
      const transcript = await provider.startListening();
      if (transcript) pushVoiceTranscript(transcript);
      return transcript;
    }
    return '';
  }

  stopListening() {
    this.activeProvider?.stopListening();
  }
}

export class TextToSpeechAdapter {
  private audio: HTMLAudioElement | null = null;
  private abortController: AbortController | null = null;
  private lastText = '';
  public onStateChange?: (state: 'idle' | 'speaking' | 'loading') => void;

  async speak(text: string, voice: VoiceGender = 'male', onEnd?: () => void) {
    this.stop();
    this.lastText = text;
    const voicePref = getVoicePreferences();
    const consent = getConsentState();
    if (!voicePref.enabled || voicePref.muted || !consent.voiceOutput) {
      onEnd?.();
      return;
    }

    // 1) cloud TTS path
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
        this.onStateChange?.('loading');
        this.abortController = new AbortController();
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voice }),
          signal: this.abortController.signal,
        });

        if (!response.ok) throw new Error(`TTS request failed: ${response.status}`);
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        this.audio = new Audio(audioUrl);
        try { audioAnalyzer.attach(this.audio); } catch { /* no-op */ }

        this.audio.onplay = () => this.onStateChange?.('speaking');
        this.audio.onended = () => {
          this.onStateChange?.('idle');
          URL.revokeObjectURL(audioUrl);
          onEnd?.();
        };
        this.audio.onerror = () => {
          this.onStateChange?.('idle');
          URL.revokeObjectURL(audioUrl);
          this.browserSpeak(text, voicePref.speed, onEnd);
        };
        await this.audio.play();
        return;
      }
    } catch {
      // continue to browser fallback
    }

    // 2) browser fallback
    this.browserSpeak(text, voicePref.speed, onEnd);
  }

  private browserSpeak(text: string, speed: number, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      this.onStateChange?.('idle');
      onEnd?.();
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = 0.9;
    utterance.onstart = () => this.onStateChange?.('speaking');
    utterance.onend = () => { this.onStateChange?.('idle'); onEnd?.(); };
    utterance.onerror = () => { this.onStateChange?.('idle'); onEnd?.(); };
    synth.speak(utterance);
  }

  replay(voice: VoiceGender = 'male', onEnd?: () => void) {
    if (this.lastText) this.speak(this.lastText, voice, onEnd);
  }

  stop() {
    this.abortController?.abort();
    this.abortController = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    window.speechSynthesis?.cancel();
    this.onStateChange?.('idle');
  }

  get isSpeaking(): boolean {
    return this.audio ? !this.audio.paused : !!window.speechSynthesis?.speaking;
  }
}

export const sttAdapter = new SpeechToTextAdapter();
export const ttsAdapter = new TextToSpeechAdapter();
