/* eslint-disable @typescript-eslint/no-explicit-any */

import { audioAnalyzer } from '@/lib/audioAnalyzer';
import { getConsentState, getVoicePreferences, pushVoiceTranscript } from '@/lib/storage';

export type VoiceGender = 'male' | 'female';

export interface SpeechToTextProvider {
  isSupported(): boolean;
  startListening(): Promise<string>;
  stopListening(): void;
}

class BrowserSpeechToTextProvider implements SpeechToTextProvider {
  private recognition: any = null;

  constructor() {
    try {
      const w = window as any;
      if (w.webkitSpeechRecognition || w.SpeechRecognition) {
        const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    } catch {
      this.recognition = null;
    }
  }

  isSupported() { return this.recognition !== null; }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject(new Error('Speech recognition not supported'));

      // Timeout safety net — if no result after 15s, reject gracefully
      const timeout = setTimeout(() => {
        try { this.recognition.abort(); } catch { /* noop */ }
        reject(new Error('Speech recognition timed out. Please try again.'));
      }, 15000);

      this.recognition.onresult = (event: any) => {
        clearTimeout(timeout);
        resolve(event.results[0][0].transcript);
      };
      this.recognition.onerror = (event: any) => {
        clearTimeout(timeout);
        const msg = event.error === 'not-allowed'
          ? 'Microphone access denied. Please enable it in your browser settings.'
          : event.error === 'no-speech'
            ? 'No speech detected. Please try again.'
            : event.error === 'network'
              ? 'Network error during speech recognition. Please check your connection.'
              : `Speech recognition error: ${event.error}`;
        reject(new Error(msg));
      };
      this.recognition.onend = () => clearTimeout(timeout);

      try {
        this.recognition.start();
      } catch (e: any) {
        clearTimeout(timeout);
        reject(new Error(e?.message || 'Failed to start speech recognition'));
      }
    });
  }

  stopListening() {
    try { this.recognition?.stop(); } catch { /* noop */ }
  }
}

class NullSpeechToTextProvider implements SpeechToTextProvider {
  isSupported() { return false; }
  async startListening(): Promise<string> { throw new Error('Speech recognition is not supported on this device. You can still type your request.'); }
  stopListening() {}
}

export class SpeechToTextAdapter {
  private providers: SpeechToTextProvider[] = [new BrowserSpeechToTextProvider(), new NullSpeechToTextProvider()];
  private activeProvider: SpeechToTextProvider | null = null;

  isSupported() {
    return this.providers.some((p) => p instanceof BrowserSpeechToTextProvider && p.isSupported());
  }

  async startListening(): Promise<string> {
    const consent = getConsentState();
    if (!consent.microphone) throw new Error('Microphone consent is required. Enable it in Settings.');

    for (const provider of this.providers) {
      if (!provider.isSupported()) continue;
      this.activeProvider = provider;
      try {
        const transcript = await provider.startListening();
        if (!transcript.trim()) throw new Error('No speech detected. Please try again or type your request.');
        if (transcript) pushVoiceTranscript(transcript);
        return transcript;
      } catch (err) {
        // If browser STT fails, try next provider
        if (provider instanceof BrowserSpeechToTextProvider && this.providers.length > 1) continue;
        throw err;
      }
    }
    return '';
  }

  stopListening() {
    try { this.activeProvider?.stopListening(); } catch { /* noop */ }
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

    // 1) Cloud TTS path
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

        if (!response.ok) throw new Error(`TTS ${response.status}`);
        const audioBlob = await response.blob();
        if (audioBlob.size < 100) throw new Error('Empty audio response');
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
    } catch (err) {
      // Silently fall through to browser TTS
      if ((err as Error)?.name === 'AbortError') {
        this.onStateChange?.('idle');
        onEnd?.();
        return;
      }
    }

    // 2) Browser fallback
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
    try { this.abortController?.abort(); } catch { /* noop */ }
    this.abortController = null;
    if (this.audio) {
      try { this.audio.pause(); this.audio.currentTime = 0; } catch { /* noop */ }
      this.audio = null;
    }
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    this.onStateChange?.('idle');
  }

  get isSpeaking(): boolean {
    return this.audio ? !this.audio.paused : !!window.speechSynthesis?.speaking;
  }
}

export const sttAdapter = new SpeechToTextAdapter();
export const ttsAdapter = new TextToSpeechAdapter();
