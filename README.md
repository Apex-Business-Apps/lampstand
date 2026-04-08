# LampStand

A gentle, local-first companion for your journey through scripture.

## Architecture

LampStand is a Vite + React + TypeScript application. It operates primarily locally, persisting state (such as Journal, Learning Data, Preferences, and Saved Passages) to LocalStorage.

It features a modular **AI Provider Adapter** `src/lib/adapters.ts` which can fall back to local seed data, or query Groq if a `VITE_GROQ_API_KEY` is provided in the environment.

## Deployment to Cloudflare Pages

This project is configured for Cloudflare Pages static assets deployment via Wrangler.
Do NOT rely on auto-detection or interactive setup.

1. Ensure dependencies are installed.
2. Build the output: `npm run build`
3. Deploy using Wrangler: `npm run deploy` (requires wrangler CLI authentication).

Configuration is handled by `wrangler.json`.

## Environment Variables

- `VITE_GROQ_API_KEY`: Optional. Used by the Groq AI adapter to fetch generated responses. If absent, local seed data is used.
- `VITE_SUPABASE_URL`: Required for sync/magic-link auth.
- `VITE_SUPABASE_ANON_KEY`: Required for sync/magic-link auth.

## Privacy & Compliance

- LampStand is local-first. Guest mode preserves all functionality without cloud sync.
- Consent is opt-in for features.
- Legal docs and terms of service require explicit human counsel review (marked as TODO in the app).
