export class BrowserTTSAdapter {
  private synth = window.speechSynthesis;

  isSupported() {
    return !!this.synth;
  }

  speak(text: string, rate: number = 0.9) {
    if (!this.synth) return;

    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google UK English Male") || v.name.includes("Daniel") || v.name.includes("Thomas"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = rate;
    utterance.pitch = 0.9;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }
}
