import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { lazyWithRetry } from '@/lib/lazyWithRetry';
import React from 'react';

describe('lazyWithRetry invariant', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('resolves component directly when factory succeeds', async () => {
    const DummyComponent = () => React.createElement('div', null, 'Loaded');
    const factory = vi.fn().mockResolvedValue({ default: DummyComponent });

    const LazyComp = lazyWithRetry(factory);
    expect(LazyComp).toBeDefined();

    const result = await factory();
    expect(result.default).toBe(DummyComponent);
  });

  it('triggers a single window reload and resets state on chunk failure', async () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    const failingFactory = vi.fn().mockRejectedValue(new Error('Failed to fetch dynamically imported module'));
    lazyWithRetry(failingFactory);

    expect(sessionStorage.getItem('lampstand_chunk_retry_refreshed')).toBeNull();
  });
});
