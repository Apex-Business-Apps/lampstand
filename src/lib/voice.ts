export class SpeechToTextAdapter {
  private recognition: unknown = null;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
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

      this.recognition.onresult = (event: unknown) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event: unknown) => {
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

export class TextToSpeechAdapter {
  private synth: SpeechSynthesis;
  public onStateChange?: (state: 'idle' | 'speaking' | 'paused') => void;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;
    this.synth.cancel(); // Cancel unknown ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    // Find a good voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Daniel') || v.name.includes('Karen') || v.lang === 'en-GB');
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 0.9; // Slightly slower, calmer
    utterance.pitch = 0.9;

    utterance.onstart = () => this.onStateChange?.('speaking');
    utterance.onend = () => {
      this.onStateChange?.('idle');
      onEnd?.();
    };
    utterance.onerror = () => {
      this.onStateChange?.('idle');
      onEnd?.();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.onStateChange?.('idle');
    }
  }
}

export const sttAdapter = new SpeechToTextAdapter();
export const ttsAdapter = new TextToSpeechAdapter();
