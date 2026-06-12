# Cloudflare Domain Cutover (thelampstand.icu)

This repository deploys as a Cloudflare Worker with static assets.
Use Worker custom-domain routes for production domain binding.

## Required Cloudflare API token scope

Create a token with all of the following:

- Account -> Cloudflare Pages -> Edit (only needed if cleaning up old Pages project)
- Account -> Workers Scripts -> Edit
- Zone -> Zone -> Read
- Zone -> DNS -> Edit
- Zone -> SSL and Certificates -> Edit
- Zone -> Zone Settings -> Edit

Token resources must include the zone for:

- thelampstand.icu

## Required GitHub repository secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `VITE_SUPABASE_URL` — set to `https://jfqivpqedhmgyqwqpwim.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` — publishable key (`sb_publishable_*` format) from Supabase Dashboard → API Keys → **"Publishable and secret API keys"** tab. This is **not** the legacy anon JWT shown on the "Legacy anon, service_role API keys" tab — those are two distinct credentials.

> **Note:** if the Supabase project `jfqivpqedhmgyqwqpwim` is paused, restore it in the Supabase dashboard before running the deploy workflow. The build will embed the URL at compile time; a paused project will cause auth and sync to fail at runtime even if the build succeeds.

## Required Supabase Edge Function secrets

Set these in Supabase Dashboard → Edge Functions → Manage secrets. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically and do not need to be set manually.

| Secret | Purpose |
|---|---|
| `GROQ_API_KEY` | Groq Orpheus TTS — primary voice provider (free tier, existing key) |
| `ELEVENLABS_API_KEY` | **No longer used** — ElevenLabs replaced by Groq Orpheus + Cloudflare Workers AI. Leave unset or remove. |
| `CLOUDFLARE_ACCOUNT_ID` | Workers AI Aura-1 fallback TTS provider |
| `CLOUDFLARE_API_TOKEN` | Workers AI Aura-1 fallback TTS provider (needs "Workers AI — Edit" permission) |

TTS provider chain: Groq Orpheus → Cloudflare Workers AI Aura-1 → browser `speechSynthesis`. All zero-cost on free tiers.

## Deploy path

1. Verify there are no conflicting A/AAAA/CNAME records for `thelampstand.icu` and `www`.
2. Run the `Deploy Worker Production` workflow or deploy locally:
   - `npm ci`
   - `npm run build`
   - `npx wrangler deploy --config wrangler.production.json`
3. Confirm custom domain routes are active in Worker settings.
4. Verify TLS mode at zone level is `Full (strict)` after origin route is healthy.
5. Validate endpoint:
   - `https://thelampstand.icu`
   - `https://www.thelampstand.icu`

## Rollback

- Re-deploy prior commit on `main` using `wrangler.json`.
- Re-point DNS records to previous stable target if route conflict occurs.
