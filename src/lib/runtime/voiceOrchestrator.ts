import {
  BrowserSpeechToTextAdapter,
  BrowserTextToSpeechAdapter,
  NullSpeechToTextAdapter,
  SilentTextToSpeechAdapter,
  type SpeechToTextAdapter,
  type TextToSpeechAdapter,
} from '@/lib/voice/adapters';

export class VoiceOrchestrator {
  private stt: SpeechToTextAdapter;
  private tts: TextToSpeechAdapter;

  constructor() {
    const browserStt = new BrowserSpeechToTextAdapter();
    this.stt = browserStt.isSupported() ? browserStt : new NullSpeechToTextAdapter();

    const browserTts = new BrowserTextToSpeechAdapter();
    this.tts = browserTts.isSupported() ? browserTts : new SilentTextToSpeechAdapter();
  }

  async captureTranscript() {
    return this.stt.listenOnce();
  }

  async speak(text: string, rate = 1) {
    await this.tts.speak(text, { rate });
  }

  stopSpeaking() {
    this.tts.stop();
  }
}
