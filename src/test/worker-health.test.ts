import { describe, expect, it, vi } from 'vitest';
import worker from '@/workers/static-spa';

describe('static worker health endpoint', () => {
  it('returns a secured healthy response without hitting assets', async () => {
    const env = { ASSETS: { fetch: vi.fn() } };
    const response = await worker.fetch(new Request('https://lampstand.test/health'), env as never);

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    await expect(response.json()).resolves.toEqual({ status: 'healthy', service: 'lampstand-static-spa' });
    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
  });
});
