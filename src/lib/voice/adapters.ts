export interface SpeechToTextAdapter {
  isSupported(): boolean;
  listenOnce(): Promise<string>;
}

export interface TextToSpeechAdapter {
  isSupported(): boolean;
  speak(text: string, options?: { rate?: number }): Promise<void>;
  stop(): void;
}

export class BrowserSpeechToTextAdapter implements SpeechToTextAdapter {
  isSupported() {
    return Boolean(window.SpeechRecognition || (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);
  }

  async listenOnce(): Promise<string> {
    const Recognition = window.SpeechRecognition || (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
    if (!Recognition) return '';
    return await new Promise((resolve, reject) => {
      const recognition = new Recognition();
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => resolve(event.results[0][0].transcript || '');
      recognition.onerror = () => reject(new Error('Speech recognition failed'));
      recognition.onend = () => resolve('');
      recognition.start();
    });
  }
}

export class NullSpeechToTextAdapter implements SpeechToTextAdapter {
  isSupported() { return true; }
  async listenOnce() { return ''; }
}

export class BrowserTextToSpeechAdapter implements TextToSpeechAdapter {
  private utterance: SpeechSynthesisUtterance | null = null;

  isSupported() { return Boolean(window.speechSynthesis); }

  async speak(text: string, options?: { rate?: number }) {
    this.stop();
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = options?.rate || 1;
    await new Promise<void>((resolve) => {
      this.utterance!.onend = () => resolve();
      window.speechSynthesis.speak(this.utterance!);
    });
  }

  stop() {
    window.speechSynthesis.cancel();
    this.utterance = null;
  }
}

export class SilentTextToSpeechAdapter implements TextToSpeechAdapter {
  isSupported() { return true; }
  async speak() { return; }
  stop() { return; }
}
