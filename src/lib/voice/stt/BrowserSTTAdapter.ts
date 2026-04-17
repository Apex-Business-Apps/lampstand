interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

interface Window {
  SpeechRecognition?: {
    new (): SpeechRecognition;
  };
  webkitSpeechRecognition?: {
    new (): SpeechRecognition;
  };
}

export class BrowserSTTAdapter {
  private recognition: SpeechRecognition | null = null;

  constructor() {
    const SpeechRecognition = (window as unknown as Window).SpeechRecognition || (window as unknown as Window).webkitSpeechRecognition;
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
