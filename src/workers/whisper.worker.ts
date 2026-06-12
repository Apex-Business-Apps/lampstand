import { pipeline, env } from '@xenova/transformers';

// Optional: Configure wasm to not look for local files if using CDN, but locally it's handled by Vite usually.
// env.allowLocalModels = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let transcriber: any = null;

self.addEventListener('message', async (e) => {
  const { type, audio } = e.data;

  if (type === 'INIT') {
    if (!transcriber) {
      self.postMessage({ type: 'STATUS', status: 'downloading' });
      try {
          transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            progress_callback: (data: any) => {
              self.postMessage({ type: 'PROGRESS', data });
            }
          });
          self.postMessage({ type: 'STATUS', status: 'ready' });
      } catch (err: unknown) {
          self.postMessage({ type: 'ERROR', error: err instanceof Error ? err.message : String(err) });
      }
    } else {
        self.postMessage({ type: 'STATUS', status: 'ready' });
    }
  } else if (type === 'PROCESS_AUDIO') {
    if (!transcriber) {
        self.postMessage({ type: 'ERROR', error: 'Transcriber not initialized' });
        return;
    }
    try {
      self.postMessage({ type: 'STATUS', status: 'processing' });
      const result = await transcriber(audio);
      self.postMessage({ type: 'RESULT', text: result.text.trim() });
    } catch (error: unknown) {
      self.postMessage({ type: 'ERROR', error: error instanceof Error ? error.message : String(error) });
    }
  }
});
