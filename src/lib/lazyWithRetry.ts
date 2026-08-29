import { lazy, type ComponentType } from 'react';

const FORCE_REFRESH_KEY = 'lampstand_chunk_retry_refreshed';

/**
 * Resilient lazy loader for code-split React components.
 *
 * If a deployment rotates chunk hashes while an installed PWA or background
 * tab holds an older asset manifest, dynamic imports will 404. This wrapper
 * catches the failure, forces a single cache-clearing page reload to fetch
 * the latest index.html and chunk manifest, and throws to ErrorBoundary only
 * if reloading fails to resolve the asset.
 */
export function lazyWithRetry<T extends ComponentType<never>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      const module = await factory();
      // On success, reset the retry flag so future chunk errors can reload once
      try {
        sessionStorage.setItem(FORCE_REFRESH_KEY, '0');
      } catch {
        /* storage quota / private mode safe */
      }
      return module;
    } catch (error) {
      let alreadyRefreshed = false;
      try {
        alreadyRefreshed = sessionStorage.getItem(FORCE_REFRESH_KEY) === '1';
      } catch {
        /* storage quota / private mode safe */
      }

      if (!alreadyRefreshed && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(FORCE_REFRESH_KEY, '1');
          // Clear service worker caches if available to avoid loading stale HTML
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
          }
        } catch {
          /* ignore cache clear failures */
        }
        window.location.reload();
        // Return a pending promise so React does not throw while the page reloads
        return new Promise<{ default: T }>(() => {});
      }

      throw error;
    }
  });
}
