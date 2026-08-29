# Architecture Node: Edge Worker and Security

## File Locations
- Static SPA Edge Worker: `src/workers/static-spa.ts`
- Cloudflare Configuration: `wrangler.json`, `wrangler.production.toml`
- Edge Functions: `supabase/functions/`
- Client Service Worker: `public/sw.js`

## Core Responsibilities

1. **SPA Routing**: Catches deep client routes (`/guidance`, `/daily`, `/sermon`, `/journal`, `/saved`, `/legal/*`) and serves `index.html` with `200 OK`.
2. **Strict Content Security Policy (CSP)**:
   - Scripts: `'self' 'unsafe-inline' 'wasm-unsafe-eval' https://*.supabase.co`
   - Styles: `'self' 'unsafe-inline' https://fonts.googleapis.com`
   - Fonts: `'self' https://fonts.gstatic.com data:`
   - Connections: `'self' https://*.supabase.co https://api.groq.com https://api.elevenlabs.io`
3. **Health Check Probes**: Dedicated `/health` endpoint returning JSON uptime status for uptime monitoring.
4. **Rate Limiting**: Enforces sliding window request caps to protect edge compute resources.

## Client Service Worker (`public/sw.js`, v5)

1. **Never intercepts provider traffic**: Supabase and Groq hostnames return early, so auth and AI calls are never served from cache.
2. **Cache-first for `/assets/`**: hashed filenames make these immutable, so a deploy busts the cache by name.
3. **Network-first for navigations**, falling back to the cached shell when the network fails.
4. **Shell freshness (v5)**: each successful navigation rewrites the cached `/` shell. `install` only re-runs when this file's bytes change, so before v5 the offline fallback was frozen at install time and could be many deploys old.
5. **Known gap**: hashed assets are cached only from the second controlled load onward. Tracked in `wiki/open_loops/service-worker-precache-on-install.md`.

Invariants are asserted in `src/test/pwa-service-worker.test.ts`.
