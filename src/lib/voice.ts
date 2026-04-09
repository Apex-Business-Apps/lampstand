/* eslint-disable @typescript-eslint/no-explicit-any */

import { audioAnalyzer } from '@/lib/audioAnalyzer';

export type VoiceGender = 'male' | 'female';

type VoiceState = 'idle' | 'speaking' | 'loading';

interface SpeechToTextPort {
  isSupported(): boolean;
  startListening(): Promise<string>;
  stopListening(): void;
}

interface TextToSpeechPort {
  speak(text: string, voice: VoiceGender, onEnd?: () => void): Promise<void>;
  stop(): void;
}

class BrowserSpeechToTextAdapter implements SpeechToTextPort {
  private recognition: any = null;

  constructor() {
    const w = window as any;
    if (w.webkitSpeechRecognition || w.SpeechRecognition) {
      const Impl = w.SpeechRecognition || w.webkitSpeechRecognition;
      this.recognition = new Impl();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  isSupported() {
    return this.recognition !== null;
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject(new Error('Speech recognition not supported'));
      this.recognition.onresult = (event: any) => resolve(event.results[0][0].transcript);
      this.recognition.onerror = (event: any) => reject(new Error(event.error));
      this.recognition.start();
    });
  }

  stopListening() {
    this.recognition?.stop();
  }
}

class NullSpeechToTextAdapter implements SpeechToTextPort {
  isSupported() {
    return false;
  }

  async startListening(): Promise<string> {
    throw new Error('Speech recognition unavailable');
  }

  stopListening() {
    // Intentional no-op fallback adapter.
  }
}

class BrowserTextToSpeechAdapter implements TextToSpeechPort {
  private utterance: SpeechSynthesisUtterance | null = null;

  async speak(text: string, _voice: VoiceGender, onEnd?: () => void): Promise<void> {
    if (!('speechSynthesis' in window)) throw new Error('Speech synthesis unavailable');
    window.speechSynthesis.cancel();
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = 0.9;
    this.utterance.pitch = 0.9;
    this.utterance.onend = () => onEnd?.();
    this.utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(this.utterance);
  }

  stop() {
    window.speechSynthesis?.cancel();
    this.utterance = null;
  }
}

class CloudTextToSpeechAdapter implements TextToSpeechPort {
  private audio: HTMLAudioElement | null = null;
  private abortController: AbortController | null = null;

  async speak(text: string, voice: VoiceGender, onEnd?: () => void): Promise<void> {
    this.stop();
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

    if (!response.ok) throw new Error(`Cloud TTS request failed: ${response.status}`);

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    this.audio = new Audio(audioUrl);
    try { audioAnalyzer.attach(this.audio); } catch { /* no-op */ }
    this.audio.onended = () => { URL.revokeObjectURL(audioUrl); onEnd?.(); };
    this.audio.onerror = () => { URL.revokeObjectURL(audioUrl); onEnd?.(); };
    await this.audio.play();
  }

  stop() {
    this.abortController?.abort();
    this.abortController = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
}

class NullTextToSpeechAdapter implements TextToSpeechPort {
  async speak(_text: string, _voice: VoiceGender, onEnd?: () => void): Promise<void> {
    onEnd?.();
  }

  stop() {
    // Intentional no-op fallback adapter.
  }
}

function resolveSttAdapters(): SpeechToTextPort[] {
  const browser = new BrowserSpeechToTextAdapter();
  return [browser, new NullSpeechToTextAdapter()];
}

function resolveTtsAdapters(): TextToSpeechPort[] {
  const cloudEnabled = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const chain: TextToSpeechPort[] = [];
  if (cloudEnabled) chain.push(new CloudTextToSpeechAdapter());
  chain.push(new BrowserTextToSpeechAdapter());
  chain.push(new NullTextToSpeechAdapter());
  return chain;
}

export class SpeechToTextAdapter {
  private readonly adapters = resolveSttAdapters();

  isSupported() {
    return this.adapters.some((adapter) => adapter.isSupported());
  }

  async startListening(): Promise<string> {
    for (const adapter of this.adapters) {
      if (!adapter.isSupported()) continue;
      try {
        return await adapter.startListening();
      } catch {
        continue;
      }
    }
    throw new Error('Speech recognition not available');
  }

  stopListening() {
    this.adapters.forEach((adapter) => adapter.stopListening());
  }
}

export class TextToSpeechAdapter {
  public onStateChange?: (state: VoiceState) => void;
  private readonly adapters = resolveTtsAdapters();

  async speak(text: string, voice: VoiceGender = 'male', onEnd?: () => void) {
    this.stop();
    this.onStateChange?.('loading');

    for (const adapter of this.adapters) {
      try {
        await adapter.speak(text, voice, () => {
          this.onStateChange?.('idle');
          onEnd?.();
        });
        this.onStateChange?.('speaking');
        return;
      } catch {
        continue;
      }
    }

    this.onStateChange?.('idle');
  }

  stop() {
    this.adapters.forEach((adapter) => adapter.stop());
    this.onStateChange?.('idle');
  }
}

export const sttAdapter = new SpeechToTextAdapter();
export const ttsAdapter = new TextToSpeechAdapter();

export async function getMicrophonePermissionState(): Promise<PermissionState | 'unsupported'> {
  if (!navigator.permissions?.query) return 'unsupported';
  try {
    const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return status.state;
  } catch {
    return 'unsupported';
  }
}
