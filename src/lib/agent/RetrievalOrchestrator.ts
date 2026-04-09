import { getRetrievalAdapter } from '../adapters';
import { ScripturePassage } from '@/types';

export class RetrievalOrchestrator {
  async retrieveContext(query: string): Promise<ScripturePassage[]> {
    const adapter = getRetrievalAdapter();
    const result = await adapter.search({ query, topK: 1 });
    return result.passages;
  }
}
