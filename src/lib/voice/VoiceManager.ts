export class VoiceManager {
  private synth = window.speechSynthesis;
  private recognition: any = null;
  private isListening = false;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  isSupported() {
    return !!this.recognition && !!this.synth;
  }

  async startListening(onResult: (text: string) => void, onError: (err: string) => void) {
    const hasConsent = localStorage.getItem("lampstand_consent_voice") === "true";
    if (!hasConsent) {
      onError("Voice access is disabled in settings.");
      return;
    }

    if (!this.recognition) {
      onError("Speech recognition not supported in this browser.");
      return;
    }

    this.recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
      this.isListening = false;
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e: any) {
      onError(e.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string) {
    const hasConsent = localStorage.getItem("lampstand_consent_voice") === "true";
    if (!hasConsent || !this.synth) return;

    this.synth.cancel(); // Stop current speaking
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google UK English Male") || v.name.includes("Daniel") || v.name.includes("Thomas"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9; // Slightly slower for reverence
    utterance.pitch = 0.9;

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceManager = new VoiceManager();
