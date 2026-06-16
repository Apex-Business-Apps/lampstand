import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock the embeddingsDB module so IDB calls don't blow up in jsdom.
vi.mock('@/lib/storage/embeddingsDB', () => ({
  openEmbeddingsDB: vi.fn().mockRejectedValue(new Error('IndexedDB not available in test')),
  getAllNodes: vi.fn().mockResolvedValue([]),
  putNode: vi.fn().mockResolvedValue(undefined),
}));

// Mock the Worker constructor so GraphRAGAdapter's EmbeddingWorkerClient
// immediately rejects — simulating a CSP block that prevents the worker script
// from loading (the real failure mode this test guards against).
beforeAll(() => {
  class MockWorkerCSPFailure {
    onmessage: ((e: MessageEvent) => void) | null = null;
    private handlers = new Map<number, { reject: (e: Error) => void }>();

    postMessage(msg: { id: number; type: string }) {
      // Simulate async CSP rejection (worker script blocked)
      Promise.resolve().then(() => {
        const onMsg = this.onmessage;
        if (onMsg) {
          onMsg(new MessageEvent('message', {
            data: { id: msg.id, type: 'ERROR', payload: 'CSP violation: worker script blocked' },
          }));
        }
      });
    }
    terminate() {}
    addEventListener() {}
    removeEventListener() {}
  }

  Object.defineProperty(globalThis, 'Worker', {
    value: MockWorkerCSPFailure,
    writable: true,
    configurable: true,
  });
});

describe('GraphRAG failure falls back to local retrieval', () => {
  it('returns results (not throws) when GraphRAG worker fails with CSP error', async () => {
    // Import after mocks are set up
    const { GraphRAGAdapter, setGraphRAGFallback } = await import('@/lib/retrieval/graphRAGAdapter');
    const { LocalRetrievalAdapter } = await import('@/lib/adapters');

    // Wire up fallback (normally done at module init in adapters.ts)
    setGraphRAGFallback(new LocalRetrievalAdapter());

    const adapter = new GraphRAGAdapter();
    const result = await adapter.search({ query: 'peace', topK: 3 });

    // Should not throw; must return a valid RetrievalResult
    expect(result).toBeDefined();
    expect(Array.isArray(result.passages)).toBe(true);
    expect(result.passages.length).toBeGreaterThanOrEqual(0);
    expect(result.source).toBeDefined();
    // Source should indicate fallback was used, not GraphRAG
    expect(['local-tfidf-semantic', 'local-seed-fallback', 'emergency-fallback']).toContain(result.source);
  });

  it('returns emergency-fallback seed passage when no fallback adapter is registered', async () => {
    const { GraphRAGAdapter, setGraphRAGFallback } = await import('@/lib/retrieval/graphRAGAdapter');

    // Clear the fallback to test the ultimate fallback path
    setGraphRAGFallback(null as unknown as import('@/types').IRetrievalAdapter);

    const adapter = new GraphRAGAdapter();
    const result = await adapter.search({ query: 'hope', topK: 1 });

    expect(result).toBeDefined();
    expect(result.passages.length).toBeGreaterThanOrEqual(1);
    expect(result.source).toBe('emergency-fallback');
  });
});
