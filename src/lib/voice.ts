/* eslint-disable @typescript-eslint/no-explicit-any */

import { audioAnalyzer } from '@/lib/audioAnalyzer';

// ─── Browser STT (unchanged) ───
export class SpeechToTextAdapter {
  private recognition: any = null;

  constructor() {
    const w = window as any;
    if (w.webkitSpeechRecognition || w.SpeechRecognition) {
      const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
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

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        reject(new Error(event.error));
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

// ─── ElevenLabs TTS Adapter ───
export type VoiceGender = 'male' | 'female';

export class ElevenLabsTTSAdapter {
  private audio: HTMLAudioElement | null = null;
  private abortController: AbortController | null = null;
  public onStateChange?: (state: 'idle' | 'speaking' | 'loading') => void;

  async speak(text: string, voice: VoiceGender = 'male', onEnd?: () => void) {
    this.stop();
    this.onStateChange?.('loading');

    try {
      this.abortController = new AbortController();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voice }),
          signal: this.abortController.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      this.audio = new Audio(audioUrl);

      // Attach audio analyzer for visualizations
      try { audioAnalyzer.attach(this.audio); } catch { /* ok */ }

      this.audio.onplay = () => this.onStateChange?.('speaking');
      this.audio.onended = () => {
        this.onStateChange?.('idle');
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };
      this.audio.onerror = () => {
        this.onStateChange?.('idle');
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };

      await this.audio.play();
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('ElevenLabs TTS error:', err);
      this.onStateChange?.('idle');
      // Fall back to browser TTS
      this.fallbackSpeak(text, onEnd);
    }
  }

  /** Browser SpeechSynthesis fallback when ElevenLabs is unavailable */
  private fallbackSpeak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.9;
    utterance.onstart = () => this.onStateChange?.('speaking');
    utterance.onend = () => { this.onStateChange?.('idle'); onEnd?.(); };
    utterance.onerror = () => { this.onStateChange?.('idle'); onEnd?.(); };
    synth.speak(utterance);
  }

  stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    window.speechSynthesis?.cancel();
    this.onStateChange?.('idle');
  }

  get isSpeaking(): boolean {
    return this.audio ? !this.audio.paused : false;
  }
}

// ─── Singletons ───
export const sttAdapter = new SpeechToTextAdapter();
export const ttsAdapter = new ElevenLabsTTSAdapter();
