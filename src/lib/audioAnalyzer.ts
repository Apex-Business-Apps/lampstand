/**
 * Hooks into an HTMLAudioElement to provide real-time amplitude (0-1).
 * Uses Web Audio API AnalyserNode.
 */
export class AudioAnalyzer {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private data: Uint8Array = new Uint8Array(0);
  private connectedElement: HTMLAudioElement | null = null;

  attach(audio: HTMLAudioElement) {
    // Avoid double-connecting the same element (Web Audio throws if you do)
    if (this.connectedElement === audio) return;
    this.detach();

    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.data = new Uint8Array(this.analyser.frequencyBinCount);

    this.source = this.ctx.createMediaElementSource(audio);
    this.source.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.connectedElement = audio;
  }

  /** Returns current amplitude 0-1 */
  getAmplitude(): number {
    if (!this.analyser) return 0;
    this.analyser.getByteTimeDomainData(this.data as unknown as Uint8Array<ArrayBuffer>);
    let sum = 0;
    for (let i = 0; i < this.data.length; i++) {
      const v = (this.data[i] - 128) / 128;
      sum += v * v;
    }
    return Math.min(1, Math.sqrt(sum / this.data.length) * 3);
  }

  detach() {
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.ctx?.close();
    this.source = null;
    this.analyser = null;
    this.ctx = null;
    this.connectedElement = null;
  }
}

export const audioAnalyzer = new AudioAnalyzer();
