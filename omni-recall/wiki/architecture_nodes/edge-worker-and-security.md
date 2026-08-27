# Architecture Node: Edge Worker and Security

## File Locations
- Static SPA Edge Worker: `src/workers/static-spa.ts`
- Cloudflare Configuration: `wrangler.json`, `wrangler.production.toml`
- Edge Functions: `supabase/functions/`

## Core Responsibilities

1. **SPA Routing**: Catches deep client routes (`/guidance`, `/daily`, `/sermon`, `/journal`, `/saved`, `/legal/*`) and serves `index.html` with `200 OK`.
2. **Strict Content Security Policy (CSP)**:
   - Scripts: `'self' 'unsafe-inline' 'wasm-unsafe-eval' https://*.supabase.co`
   - Styles: `'self' 'unsafe-inline' https://fonts.googleapis.com`
   - Fonts: `'self' https://fonts.gstatic.com data:`
   - Connections: `'self' https://*.supabase.co https://api.groq.com https://api.elevenlabs.io`
3. **Health Check Probes**: Dedicated `/health` endpoint returning JSON uptime status for uptime monitoring.
4. **Rate Limiting**: Enforces sliding window request caps to protect edge compute resources.
