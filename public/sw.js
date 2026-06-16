/* The LampStand — service worker v3
 * v3: bump cache name to clear stale v2 entries (old chunk hashes).
 * v2: adds cache-first strategy for hashed static assets.
 * Notification click handling from v1 is preserved unchanged.
 */

const CACHE_NAME = 'lampstand-shell-v3';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add('/'))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      ),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept Supabase or Groq API traffic
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('groq.com')
  ) {
    return;
  }

  // Cache-first for hashed /assets/ (immutable — hash busts cache on deploy)
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            }
            return res;
          })
      )
    );
    return;
  }

  // Network-first for HTML navigation (ensures fresh SPA shell on each deploy)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/').then((r) => r ?? Response.error())
      )
    );
    return;
  }
});

// Notification click handler (v1 — unchanged)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/daily';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      const url = new URL(client.url);
      if (url.pathname.startsWith('/') && 'focus' in client) {
        client.navigate(targetUrl);
        return client.focus();
      }
    }
    if (self.clients.openWindow) {
      return self.clients.openWindow(targetUrl);
    }
  })());
});
