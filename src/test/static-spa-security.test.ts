import { describe, expect, it, vi } from 'vitest';
import worker from '@/workers/static-spa';

describe('static worker edge security, canonicalization & caching', () => {
  describe('canonical host consolidation', () => {
    it('redirects www.thelampstand.icu to https://thelampstand.icu via 301', async () => {
      const assetsFetch = vi.fn();
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://www.thelampstand.icu/app?view=daily', {
        headers: { accept: 'text/html' },
      });
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('https://thelampstand.icu/app?view=daily');
      expect(assetsFetch).not.toHaveBeenCalled();
    });

    it('redirects lampstand.pages.dev to https://thelampstand.icu via 301', async () => {
      const assetsFetch = vi.fn();
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://lampstand.pages.dev/guidance', {
        headers: { accept: 'text/html' },
      });
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('https://thelampstand.icu/guidance');
      expect(assetsFetch).not.toHaveBeenCalled();
    });

    it('allows canonical host https://thelampstand.icu without redirecting', async () => {
      const assetsFetch = vi.fn().mockResolvedValue(new Response('<html></html>', { status: 200 }));
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/app', {
        headers: { accept: 'text/html' },
      });
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(200);
      expect(assetsFetch).toHaveBeenCalled();
    });
  });

  describe('exploit probe defense', () => {
    const probePaths = [
      '/.env',
      '/.env.local',
      '/.git/config',
      '/wordpress/',
      '/wp/',
      '/wp-admin/index.php',
      '/wp-login.php',
      '/xmlrpc.php',
      '/setup.php',
      '/cgi-bin/test.cgi',
      '/phpmyadmin/index.php',
      '/config.bak',
      '/dump.sql',
    ];

    it.each(probePaths)('blocks exploit probe path %s with 403 at the edge without invoking ASSETS', async (path) => {
      const assetsFetch = vi.fn();
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request(`https://thelampstand.icu${path}`);
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(403);
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=86400');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(assetsFetch).not.toHaveBeenCalled();
    });
  });

  describe('hostile scanner subnet rejection', () => {
    it('blocks known scanner IP from 185.177.72.0/24 subnet', async () => {
      const assetsFetch = vi.fn();
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/robots.txt', {
        headers: { 'CF-Connecting-IP': '185.177.72.29' },
      });
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(403);
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=86400');
      expect(assetsFetch).not.toHaveBeenCalled();
    });

    it('blocks known scanner IP from 146.70.255.0/24 subnet', async () => {
      const assetsFetch = vi.fn();
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/', {
        headers: { 'CF-Connecting-IP': '146.70.255.23' },
      });
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(403);
      expect(assetsFetch).not.toHaveBeenCalled();
    });

    it('permits benign traffic from clean visitor IPs', async () => {
      const assetsFetch = vi.fn().mockResolvedValue(new Response('User-agent: *', { status: 200 }));
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/robots.txt', {
        headers: { 'CF-Connecting-IP': '75.156.166.160' },
      });
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(200);
      expect(assetsFetch).toHaveBeenCalled();
    });
  });

  describe('deterministic Cache-Control policies', () => {
    it('sets 1-year immutable cache on hashed Vite /assets/ bundles', async () => {
      const assetsFetch = vi.fn().mockResolvedValue(new Response('console.log("chunk")', {
        status: 200,
        headers: { 'content-type': 'application/javascript' },
      }));
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/assets/index-Dqu2_dO8.js');
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    });

    it('sets no-store on HTML navigation requests', async () => {
      const assetsFetch = vi.fn().mockResolvedValue(new Response('<!doctype html><html></html>', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      }));
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/app', {
        headers: { accept: 'text/html' },
      });
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
    });

    it('sets no-cache, no-store on service worker /sw.js', async () => {
      const assetsFetch = vi.fn().mockResolvedValue(new Response('self.addEventListener(...)', {
        status: 200,
        headers: { 'content-type': 'application/javascript' },
      }));
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/sw.js');
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
    });

    it('sets 1-hour cache on manifest.json', async () => {
      const assetsFetch = vi.fn().mockResolvedValue(new Response('{"name":"TheLampStand"}', {
        status: 200,
        headers: { 'content-type': 'application/manifest+json' },
      }));
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/manifest.json');
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
    });

    it('sets 24-hour cache on robots.txt and sitemap.xml', async () => {
      const assetsFetch = vi.fn().mockResolvedValue(new Response('User-agent: *', { status: 200 }));
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/robots.txt');
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=86400, stale-while-revalidate=604800');
    });

    it('sets 24-hour cache and security headers on streamed media assets', async () => {
      const assetsFetch = vi.fn().mockResolvedValue(new Response(new Uint8Array([0, 1, 2]), {
        status: 200,
        headers: { 'content-type': 'audio/mpeg' },
      }));
      const env = { ASSETS: { fetch: assetsFetch } };

      const request = new Request('https://thelampstand.icu/brand-anthem.mp3');
      const response = await worker.fetch(request, env as never);

      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=86400, stale-while-revalidate=604800');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });
  });
});
