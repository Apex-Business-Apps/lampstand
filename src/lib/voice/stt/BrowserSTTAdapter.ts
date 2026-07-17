export class BrowserSTTAdapter {
  private recognition: SpeechRecognition | null = null;

  constructor() {
    const w = window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition, SpeechRecognition?: typeof SpeechRecognition };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (SR) {
      this.recognition = new SR();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  isSupported() {
    return !!this.recognition;
  }

  async startListening(onResult: (text: string) => void, onError: (err: string) => void) {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser.");
      return;
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (e: unknown) {
      if (e instanceof Error) { onError(e.message); } else { onError(String(e)); }
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
