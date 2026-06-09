import { getRetrievalAdapter } from '../adapters';
import { ScripturePassage } from '@/types';

export class RetrievalOrchestrator {
  async retrieveContext(query: string): Promise<ScripturePassage[]> {
    const adapter = getRetrievalAdapter();
    const normalizedQuery = query.replace(/\s+/g, ' ').trim().slice(0, 1200);
    if (!normalizedQuery) return [];

    const result = await adapter.search({ query: normalizedQuery, topK: 3 });
    return result.passages;
  }
}
