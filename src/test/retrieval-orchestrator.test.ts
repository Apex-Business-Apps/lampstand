import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RetrievalOrchestrator } from '@/lib/runtime/agentRuntime';
import { setRetrievalAdapter, getRetrievalAdapter } from '@/lib/adapters';
import type { IRetrievalAdapter, ScripturePassage, RetrievalResult } from '@/types';

describe('RetrievalOrchestrator (live runtime)', () => {
  let originalAdapter: IRetrievalAdapter;

  beforeEach(() => {
    originalAdapter = getRetrievalAdapter();
  });

  afterEach(() => {
    setRetrievalAdapter(originalAdapter);
  });

  it('should retrieve passages using the configured adapter with topK: 5', async () => {
    const mockPassages: ScripturePassage[] = [
      {
        id: '1',
        book: 'Psalm',
        chapter: 23,
        verseStart: 1,
        verseEnd: 1,
        text: 'The Lord is my shepherd; I shall not want.',
        translation: 'KJV',
        reference: 'Psalm 23:1',
      },
    ];

    const mockAdapter: IRetrievalAdapter = {
      search: vi.fn().mockResolvedValue({
        passages: mockPassages,
        confidence: 0.95,
        source: 'mock',
      } as RetrievalResult),
      getByReference: vi.fn(),
    };

    setRetrievalAdapter(mockAdapter);

    const orchestrator = new RetrievalOrchestrator();
    const query = 'comforting verses';
    const result = await orchestrator.retrieve(query);

    expect(mockAdapter.search).toHaveBeenCalledWith({
      query,
      topK: 5,
    });
    expect(result).toEqual(mockPassages);
  });

  it('should handle empty results gracefully', async () => {
    const mockAdapter: IRetrievalAdapter = {
      search: vi.fn().mockResolvedValue({
        passages: [],
        confidence: 0.3,
        source: 'mock-empty',
      } as RetrievalResult),
      getByReference: vi.fn(),
    };

    setRetrievalAdapter(mockAdapter);

    const orchestrator = new RetrievalOrchestrator();
    const result = await orchestrator.retrieve('non-existent');

    expect(result).toEqual([]);
  });
});
