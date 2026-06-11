# LampStand

*Version 2.0.0 — Updated: June 2026*

LampStand is a local-first scripture companion built with React, TypeScript, and Vite.

## Architecture Overview

- **UI**: React 18 + Tailwind + shadcn/ui
- **Routing**: react-router
- **Auth**: Supabase magic-link with guest mode preserved by default
- **Persistence**: localStorage-first typed modules in `src/lib/storage.ts`
- **AI Provider Adapter**: `src/lib/adapters.ts` with Groq primary (`GroqAIAdapter`) and local fallback
- **Agent Orchestration**: `src/hooks/useAgentController.ts` (headless UI-agnostic runtime state management)
- **Agent Runtime**: `src/lib/runtime/agentRuntime.ts` (safety gate, turn pipeline, retrieval, circuit breaker)
- **Voice**: `src/lib/voice.ts` (STT browser/null fallback, TTS cloud/browser/silent fallback)
- **Deploy**: Cloudflare Workers static assets via explicit `wrangler.json`

## Modes

- **Guest mode**: full local usage, no login required
- **Signed-in mode**: optional sync/account-linked persistence

## Consent and Data Handling

Settings now include explicit opt-in toggles for:
- local adaptive memory
- local journal storage
- optional cloud sync
- notifications
- microphone
- voice output
- account-linked persistence
- **Gentle Mode** (hides streak visuals and gamification pressure for neurodivergent alignment)

Defaults are privacy-first. Raw audio is not stored by default. Transcripts are local-first and can be deleted.

## Environment Variables

### Frontend (build-time — baked into the JS bundle, safe to expose)
- `VITE_SUPABASE_URL` — Supabase project URL, e.g. `https://jfqivpqedhmgyqwqpwim.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` — the **publishable key** (`sb_publishable_*` format) from Supabase Dashboard → API Keys → **"Publishable and secret API keys"** tab. **Do not use the legacy anon JWT** from the "Legacy anon, service_role API keys" tab — that is a separate, older credential and Supabase itself recommends against it for new setups.

### Server-side secrets (Supabase Dashboard → Project Settings → Edge Functions → Secrets)
- `GROQ_API_KEY` — AI guidance provider; **never put this in a `VITE_` variable or commit it**
- `ELEVENLABS_API_KEY` — TTS provider key; same rule applies

### CI/CD (GitHub repository secrets)
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Supabase Edge Function Secrets (set in Dashboard > Edge Functions > Secrets)
- `GROQ_API_KEY` — used by `groq-guidance` edge function
- `ELEVENLABS_API_KEY` — used by `elevenlabs-tts` edge function

> **Do not** prefix server-side secrets with `VITE_`. Those are bundled into client JS and are public.


## Where to Place Variables (Cloudflare)

LampStand now deploys with `wrangler deploy` as a **Worker with static assets**, not Cloudflare Pages framework auto-detect.

1. **Client variables (`VITE_*`)** are build-time values. They must exist **before `npm run build`**.
   - Local: put them in `.env.local`.
   - CI: store as CI secrets and export them before build.
   - If you still use Pages builds, set them under **Pages Project -> Settings -> Environment variables**.
2. **Worker runtime secrets** (non-`VITE_*`) go to Worker settings or Wrangler secrets:
   - `npx wrangler secret put SECRET_NAME`
   - Dashboard: **Workers & Pages -> your Worker -> Settings -> Variables and Secrets**.
3. Do not put sensitive secrets in `VITE_*`. Those are bundled into client JS and are public by design.

## Install / Build / Test

```bash
npm ci
npm run lint
npm run test
npm run build
```

## Cloudflare Deployment (exact steps)

**Local / staging** (uses `wrangler.json` — no custom domain routes):
```bash
npm ci
npm run build
npx wrangler deploy --config wrangler.json
```

**Production CI** (uses `wrangler.production.json` — includes `thelampstand.icu` route bindings):
```bash
# The `Deploy Worker Production` GitHub Actions workflow runs this automatically on push to main.
# To trigger manually from local:
npm ci
npm run build
npx wrangler deploy --config wrangler.production.json
```

## Legal and Compliance Surfaces

Routes:
- `/legal`
- `/legal/privacy`
- `/legal/terms`
- `/legal/acceptable-use`
- `/legal/disclaimer`
- `/legal/company`

Ownership language references APEX Business Systems LTD with explicit counsel-review TODO markers where legal finalization is required.

## Testing Commands

```bash
npm run test           # Vitest unit & integration tests
npm run test:e2e       # Playwright visual snapshots
npm run lint           # ESLint
npm run typecheck      # TypeScript validation
```

- privacy jurisdiction-specific language
- arbitration/limitation clauses
- minors policy wording
- official company legal contact metadata
