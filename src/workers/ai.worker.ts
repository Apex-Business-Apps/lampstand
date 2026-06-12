import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

let extractor: unknown = null;

self.addEventListener('message', async (event: MessageEvent) => {
  const { id, type, payload } = event.data;
  
  if (type === 'INIT') {
    try {
      if (!extractor) {
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      }
      self.postMessage({ id, type: 'INIT_DONE' });
    } catch (e: unknown) {
      self.postMessage({ id, type: 'ERROR', payload: e instanceof Error ? e.message : String(e) });
    }
  } else if (type === 'GET_EMBEDDING') {
    try {
      if (!extractor) {
        throw new Error('Worker not initialized');
      }
      const output = await extractor(payload, { pooling: 'mean', normalize: true });
      self.postMessage({ id, type: 'RESULT', payload: Array.from(output.data) });
    } catch (e: unknown) {
      self.postMessage({ id, type: 'ERROR', payload: e instanceof Error ? e.message : String(e) });
    }
  }
});
