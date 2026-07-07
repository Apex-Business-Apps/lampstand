import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const sw = fs.readFileSync('public/sw.js', 'utf8');

describe('service worker (public/sw.js) invariants', () => {
  it('names a versioned cache (so activate can evict stale entries)', () => {
    expect(sw).toMatch(/CACHE_NAME\s*=\s*['"][\w-]+['"]/);
  });

  it('cleans up old caches on activate, not just claims clients', () => {
    expect(sw).toContain('caches.delete');
    expect(sw).toContain('clients.claim');
  });

  it('calls skipWaiting so updates take effect without a stray extra reload', () => {
    expect(sw).toContain('skipWaiting');
  });

  it('never intercepts Supabase or Groq API traffic (would break auth/AI calls offline-first)', () => {
    expect(sw).toContain("url.hostname.includes('supabase.co')");
    expect(sw).toContain("url.hostname.includes('groq.com')");
  });

  it('only cache-first-serves hashed /assets/ paths, not arbitrary routes', () => {
    expect(sw).toContain("url.pathname.startsWith('/assets/')");
  });

  it('falls back to the cached shell for navigations when offline', () => {
    expect(sw).toContain("request.mode === 'navigate'");
    expect(sw).toContain("caches.match('/')");
  });

  it('handles notification clicks by focusing/opening the reminder target', () => {
    expect(sw).toContain("addEventListener('notificationclick'");
    expect(sw).toContain('clients.openWindow');
  });
});
