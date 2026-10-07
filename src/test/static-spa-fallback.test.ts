import { describe, expect, it, vi } from 'vitest';
import worker from '@/workers/static-spa';

const htmlRequest = (path: string) =>
  new Request(`https://lampstand.test${path}`, {
    headers: { accept: 'text/html,application/xhtml+xml' },
  });

describe('static worker SPA fallback', () => {
  it('falls back to / (not /index.html) so deep links are not redirected away', async () => {
    const assetsFetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('not found', { status: 404 }))
      .mockResolvedValueOnce(new Response('<html>app</html>', { status: 200 }));
    const env = { ASSETS: { fetch: assetsFetch } };

    const response = await worker.fetch(htmlRequest('/app'), env as never);

    expect(response.status).toBe(200);
    expect(assetsFetch).toHaveBeenCalledTimes(2);
    const fallbackRequest = assetsFetch.mock.calls[1][0] as Request;
    expect(new URL(fallbackRequest.url).pathname).toBe('/');
  });

  it('does not fall back for asset-like paths', async () => {
    const assetsFetch = vi.fn().mockResolvedValue(new Response('not found', { status: 404 }));
    const env = { ASSETS: { fetch: assetsFetch } };

    const response = await worker.fetch(htmlRequest('/missing.js'), env as never);

    expect(response.status).toBe(404);
    expect(assetsFetch).toHaveBeenCalledTimes(1);
  });

  it('falls back to / on HEAD requests to SPA deep routes (e.g. curl -I /app, uptime probes)', async () => {
    const assetsFetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const env = { ASSETS: { fetch: assetsFetch } };

    const headRequest = new Request('https://lampstand.test/daily', { method: 'HEAD' });
    const response = await worker.fetch(headRequest, env as never);

    expect(response.status).toBe(200);
    expect(assetsFetch).toHaveBeenCalledTimes(2);
    const fallbackRequest = assetsFetch.mock.calls[1][0] as Request;
    expect(new URL(fallbackRequest.url).pathname).toBe('/');
    expect(fallbackRequest.method).toBe('HEAD');
  });

  it('falls back to / on GET requests without accept: text/html (e.g. curl, link unfurlers)', async () => {
    const assetsFetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('not found', { status: 404 }))
      .mockResolvedValueOnce(new Response('<html>app</html>', { status: 200 }));
    const env = { ASSETS: { fetch: assetsFetch } };

    const plainGetRequest = new Request('https://lampstand.test/guidance', { method: 'GET' });
    const response = await worker.fetch(plainGetRequest, env as never);

    expect(response.status).toBe(200);
    expect(assetsFetch).toHaveBeenCalledTimes(2);
    const fallbackRequest = assetsFetch.mock.calls[1][0] as Request;
    expect(new URL(fallbackRequest.url).pathname).toBe('/');
  });

  it('serves a CSP that permits Google Fonts used by index.html', async () => {
    const assetsFetch = vi.fn().mockResolvedValue(new Response('<html></html>', { status: 200 }));
    const env = { ASSETS: { fetch: assetsFetch } };

    const response = await worker.fetch(htmlRequest('/'), env as never);
    const csp = response.headers.get('Content-Security-Policy') ?? '';

    expect(csp).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
    expect(csp).toContain("font-src 'self' https://fonts.gstatic.com");
    expect(csp).toContain("connect-src 'self' https://*.supabase.co https://api.groq.com");
  });
});
