/* eslint-disable @typescript-eslint/no-explicit-any */

import type { VoiceGender } from '@/lib/voice';

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';

const VOICE_MAP: Record<VoiceGender, string> = {
  male: 'am_fenrir',
  female: 'af_heart',
};

async function detectDevice(): Promise<{ device: 'webgpu' | 'wasm'; dtype: 'fp16' | 'q4' }> {
  try {
    if ('gpu' in navigator && (navigator as any).gpu) {
      const adapter = await (navigator as any).gpu.requestAdapter();
      if (adapter) return { device: 'webgpu', dtype: 'fp16' };
    }
  } catch {
    // fall through to WASM
  }
  return { device: 'wasm', dtype: 'q4' };
}

export class KokoroTTSAdapter {
  private pipeline: any = null;
  private loadingPromise: Promise<void> | null = null;
  private audioCtx: AudioContext | null = null;
  private activeNodes: AudioBufferSourceNode[] = [];
  private scheduledEndTime = 0;
  private aborted = false;

  preload(): void {
    if (!this.loadingPromise) {
      this.loadingPromise = this._load().catch(() => {
        this.loadingPromise = null;
        this.pipeline = null;
      });
    }
  }

  private async _load(): Promise<void> {
    const { KokoroTTS } = await import('kokoro-js');
    const { device, dtype } = await detectDevice();
    this.pipeline = await KokoroTTS.from_pretrained(MODEL_ID, { dtype, device });
  }

  isReady(): boolean {
    return this.pipeline !== null;
  }

  async speak(
    text: string,
    voice: VoiceGender = 'male',
    speed: number = 1.0,
    onEnd?: () => void,
    onStateChange?: (state: 'idle' | 'speaking' | 'loading') => void,
  ): Promise<void> {
    if (!this.pipeline) {
      if (!this.loadingPromise) this.preload();
      await this.loadingPromise;
    }
    if (!this.pipeline) throw new Error('Kokoro model unavailable');

    this.stop();
    this.aborted = false;

    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      this.audioCtx = new AudioContext({ sampleRate: 24000 });
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    onStateChange?.('loading');
    this.scheduledEndTime = this.audioCtx.currentTime;
    let firstChunk = true;

    try {
      const stream = this.pipeline.stream(text, {
        voice: VOICE_MAP[voice] ?? VOICE_MAP.male,
        speed,
      });

      for await (const { audio } of stream) {
        if (this.aborted) break;

        if (firstChunk) {
          onStateChange?.('speaking');
          firstChunk = false;
        }

        const samples: Float32Array = audio.audio;
        const sr: number = audio.sampling_rate;
        const buffer = this.audioCtx.createBuffer(1, samples.length, sr);
        buffer.copyToChannel(samples, 0);

        const src = this.audioCtx.createBufferSource();
        src.buffer = buffer;
        src.connect(this.audioCtx.destination);

        const startTime = Math.max(this.audioCtx.currentTime, this.scheduledEndTime);
        src.start(startTime);
        this.scheduledEndTime = startTime + buffer.duration;
        this.activeNodes.push(src);
      }

      if (!this.aborted) {
        const remainingMs = (this.scheduledEndTime - this.audioCtx.currentTime) * 1000;
        if (remainingMs > 0) {
          await new Promise<void>((resolve) => setTimeout(resolve, remainingMs + 100));
        }
        if (!this.aborted) {
          onStateChange?.('idle');
          onEnd?.();
        }
      }
    } catch (err) {
      onStateChange?.('idle');
      throw err;
    }
  }

  stop(): void {
    this.aborted = true;
    for (const node of this.activeNodes) {
      try { node.stop(); node.disconnect(); } catch { /* noop */ }
    }
    this.activeNodes = [];
    this.scheduledEndTime = 0;
  }
}

export const kokoroAdapter = new KokoroTTSAdapter();
