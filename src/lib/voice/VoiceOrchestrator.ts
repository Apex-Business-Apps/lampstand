import { BrowserSTTAdapter } from './stt/BrowserSTTAdapter';
import { BrowserTTSAdapter } from './tts/BrowserTTSAdapter';
import { getConsentState } from '@/lib/storage';

export class VoiceOrchestrator {
  private stt = new BrowserSTTAdapter();
  private tts = new BrowserTTSAdapter();
  private isListening = false;
  private isSpeaking = false;

  isSupported() {
    return this.stt.isSupported() || this.tts.isSupported();
  }

  async startListening(onResult: (text: string) => void, onError: (err: string) => void) {
    if (!getConsentState().voiceOutput) {
      onError("Voice access is disabled in settings.");
      return;
    }

    this.isListening = true;
    this.stt.startListening(
      (text) => {
        this.isListening = false;
        onResult(text);
      },
      (err) => {
        this.isListening = false;
        onError(err);
      }
    );
  }

  stopListening() {
    this.stt.stopListening();
    this.isListening = false;
  }

  speak(text: string, rate?: number) {
    if (!getConsentState().voiceOutput) return;
    this.isSpeaking = true;
    this.tts.speak(text, rate);
  }

  stopSpeaking() {
    this.tts.stop();
    this.isSpeaking = false;
  }

  getIsListening() { return this.isListening; }
  getIsSpeaking() { return this.isSpeaking; }
}

export const voiceOrchestrator = new VoiceOrchestrator();
