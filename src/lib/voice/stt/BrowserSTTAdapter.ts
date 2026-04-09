export class BrowserSTTAdapter {
  private recognition: any = null;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
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

    this.recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      onError(e.message);
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
