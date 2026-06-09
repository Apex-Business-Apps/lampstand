import { describe, expect, it, vi } from 'vitest';
import type { AIProviderAdapter } from '@/lib/ai/types';
import { ConversationOrchestrator } from '@/lib/agent/ConversationOrchestrator';
import { getRetrievalAdapter, setRetrievalAdapter } from '@/lib/adapters';
import type { IRetrievalAdapter, RetrievalResult, ScripturePassage } from '@/types';

const passage: ScripturePassage = {
  id: 'phil-4-6-7',
  book: 'Philippians',
  chapter: 4,
  verseStart: 6,
  verseEnd: 7,
  text: 'Have no anxiety at all, but in everything, by prayer and petition, with thanksgiving, make your requests known to God.',
  translation: 'NABRE',
  reference: 'Philippians 4:6-7',
};

function provider(output: string): AIProviderAdapter {
  return {
    id: 'test',
    isAvailable: () => true,
    generateText: vi.fn().mockResolvedValue(output),
  };
}

describe('grounded conversation safety', () => {
  it('returns scripture answers with source citations', async () => {
    const original = getRetrievalAdapter();
    const adapter: IRetrievalAdapter = {
      search: vi.fn().mockResolvedValue({ passages: [passage], confidence: 0.9, source: 'test' } satisfies RetrievalResult),
      getByReference: vi.fn(),
    };
    setRetrievalAdapter(adapter);

    try {
      const orchestrator = new ConversationOrchestrator(provider('Bring anxiety to God in prayer.'));
      const result = await orchestrator.runTurn('What does Scripture say about anxiety?', { sessionId: 's', mode: 'guidance', history: [] });

      expect(result.response).toContain('Sources: Philippians 4:6-7.');
      expect(adapter.search).toHaveBeenCalledWith({ query: 'What does Scripture say about anxiety?', topK: 3 });
    } finally {
      setRetrievalAdapter(original);
    }
  });

  it('rejects fabricated scripture requests before model execution', async () => {
    const mockProvider = provider('fake output');
    const orchestrator = new ConversationOrchestrator(mockProvider);
    const result = await orchestrator.runTurn('Make up a Bible verse about winning sales calls.', { sessionId: 's', mode: 'guidance', history: [] });

    expect(result.isFallback).toBe(true);
    expect(result.response).toContain('cannot invent');
    expect(mockProvider.generateText).not.toHaveBeenCalled();
  });

  it('redirects sensitive counseling requests to appropriate support', async () => {
    const mockProvider = provider('fake output');
    const orchestrator = new ConversationOrchestrator(mockProvider);
    const result = await orchestrator.runTurn('I might hurt myself tonight.', { sessionId: 's', mode: 'guidance', history: [] });

    expect(result.isFallback).toBe(true);
    expect(result.response).toContain('emergency services');
    expect(mockProvider.generateText).not.toHaveBeenCalled();
  });

  it('marks ungrounded answers as unverifiable from LampStand sources', async () => {
    const original = getRetrievalAdapter();
    setRetrievalAdapter({
      search: vi.fn().mockResolvedValue({ passages: [], confidence: 0, source: 'test-empty' } satisfies RetrievalResult),
      getByReference: vi.fn(),
    });

    try {
      const orchestrator = new ConversationOrchestrator(provider('That claim needs outside context.'));
      const result = await orchestrator.runTurn('Who wrote a modern commentary?', { sessionId: 's', mode: 'guidance', history: [] });
      expect(result.response).toMatch(/^LampStand cannot verify this from available source passages\./);
    } finally {
      setRetrievalAdapter(original);
    }
  });
});
