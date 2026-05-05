import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RetrievalOrchestrator } from '../lib/agent/RetrievalOrchestrator';
import { setRetrievalAdapter, getRetrievalAdapter } from '../lib/adapters';
import { IRetrievalAdapter, ScripturePassage, RetrievalResult } from '@/types';

describe('RetrievalOrchestrator', () => {
  let originalAdapter: IRetrievalAdapter;

  beforeEach(() => {
    originalAdapter = getRetrievalAdapter();
  });

  afterEach(() => {
    setRetrievalAdapter(originalAdapter);
  });

  it('should retrieve context using the configured adapter', async () => {
    const mockPassages: ScripturePassage[] = [
      {
        id: '1',
        book: 'Psalm',
        chapter: 23,
        verseStart: 1,
        verseEnd: 1,
        text: 'The Lord is my shepherd; I shall not want.',
        translation: 'KJV',
        reference: 'Psalm 23:1'
      }
    ];

    const mockAdapter: IRetrievalAdapter = {
      search: vi.fn().mockResolvedValue({
        passages: mockPassages,
        confidence: 0.95,
        source: 'mock'
      } as RetrievalResult),
      getByReference: vi.fn()
    };

    setRetrievalAdapter(mockAdapter);

    const orchestrator = new RetrievalOrchestrator();
    const query = 'comforting verses';
    const result = await orchestrator.retrieveContext(query);

    expect(mockAdapter.search).toHaveBeenCalledWith({
      query: query,
      topK: 1
    });
    expect(result).toEqual(mockPassages);
  });

  it('should handle empty results from adapter', async () => {
    const mockAdapter: IRetrievalAdapter = {
      search: vi.fn().mockResolvedValue({
        passages: [],
        confidence: 0.3,
        source: 'mock-empty'
      } as RetrievalResult),
      getByReference: vi.fn()
    };

    setRetrievalAdapter(mockAdapter);

    const orchestrator = new RetrievalOrchestrator();
    const result = await orchestrator.retrieveContext('non-existent');

    expect(result).toEqual([]);
  });
});
