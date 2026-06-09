import type { IAIAdapter, IRetrievalAdapter } from '@/types';
import { LocalAIAdapter, LocalRetrievalAdapter } from './adapters';
import { GroqAIAdapter } from './groq';

// Singleton instances
let retrievalAdapter: IRetrievalAdapter = new LocalRetrievalAdapter();
let aiAdapter: IAIAdapter = import.meta.env.VITE_GROQ_API_KEY ? new GroqAIAdapter() : new LocalAIAdapter();

export function getRetrievalAdapter(): IRetrievalAdapter {
  return retrievalAdapter;
}

export function getAIAdapter(): IAIAdapter {
  return aiAdapter;
}

export function setRetrievalAdapter(a: IRetrievalAdapter) {
  retrievalAdapter = a;
}

export function setAIAdapter(a: IAIAdapter) {
  aiAdapter = a;
}
