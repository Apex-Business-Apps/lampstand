# LampStand

LampStand is a local-first scripture companion built with React, TypeScript, and Vite.

## Architecture Overview

- **UI**: React 18 + Tailwind + shadcn/ui
- **Routing**: react-router
- **Auth**: Supabase magic-link with guest mode preserved by default
- **Persistence**: localStorage-first typed modules in `src/lib/storage.ts`
- **AI Provider Adapter**: `src/lib/adapters.ts` with Groq primary (`GroqAIAdapter`) and local fallback
- **Agent Runtime**: `src/lib/runtime/agentRuntime.ts` (safety gate, turn pipeline, retrieval, circuit breaker)
- **Voice**: `src/lib/voice.ts` (STT browser/null fallback, TTS cloud/browser/silent fallback)
- **Deploy**: Cloudflare Workers static assets via explicit `wrangler.json`

## Modes

LampStand is a Roman Catholic-friendly, web-first, mobile-responsive Bible companion. It helps users engage with scripture through pastoral guidance, daily readings, journaling, and an immersive burning-bush voice agent.

## Consent and Data Handling

| Layer | Technology |
|---|---|
| Frontend | React 18 · Vite 6 · TypeScript 5 · Tailwind CSS 3 |
| Backend | Supabase (Auth, Postgres, Edge Functions) |
| AI | Groq (llama-3.3-70b) via modular runtime adapters with local seed fallback |
| TTS | ElevenLabs (George/Matilda voices) → browser SpeechSynthesis fallback |
| STT | Web Speech API (free, browser-native) |
| Hosting | Cloudflare Pages via explicit Wrangler config and static dist deploy |

### Runtime pipeline

LampStand now includes a modular agent runtime layer:

- `AgentRuntime`
- `TurnPipeline`
- `SessionStateMachine`
- `CircuitBreaker`
- `SafetyGate`
- `RetrievalOrchestrator`
- `ConversationOrchestrator`

### Runtime pipeline

LampStand now includes a modular agent runtime layer:

- `AgentRuntime`
- `TurnPipeline`
- `SessionStateMachine`
- `CircuitBreaker`
- `SafetyGate`
- `RetrievalOrchestrator`
- `ConversationOrchestrator`

Defaults are privacy-first. Raw audio is not stored by default. Transcripts are local-first and can be deleted.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `VITE_GROQ_API_KEY` | No | Groq API key (falls back to local seed data) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key for client billing flows |

### Supabase Secrets (Edge Functions)

### Optional/Infrastructure
- `CLOUDFLARE_ACCOUNT_ID` (CI deploy convenience)
- `CLOUDFLARE_API_TOKEN` (CI deploy)


## Where to Place Variables (Cloudflare)

LampStand now deploys with `wrangler deploy` as a **Worker with static assets**, not Cloudflare Pages framework auto-detect.

# Type-check
npm run typecheck

## Install / Build / Test

# Run responsive route audit
npm run test:e2e

# Run responsive route audit
npm run test:e2e

# Build for production
npm run build

# Deploy to Cloudflare (interactive/local)
npm run deploy

# Deploy to Cloudflare (CI)
npm run deploy:ci
```

## Cloudflare Deployment (exact steps)

```bash
npm ci
npm run build
npx wrangler deploy --config wrangler.json
```

CI-safe one-liner:

- Local-first: full guest functionality without account creation
- Cloud sync opt-in via Supabase Auth (magic link or Google OAuth)
- No tracking pixels, no third-party analytics
- Dedicated policy routes: `/legal/privacy`, `/legal/terms`, `/legal/aup`, `/legal/disclaimer`
- Legal/terms pages require human counsel review (marked TODO)

## Cloudflare Deployment Notes

- This project does not rely on Wrangler framework auto-detection.
- Build output is `dist`.
- SPA fallback is configured in `wrangler.json` with `assets.not_found_handling = "single-page-application"`.
- Deploy command is explicit: `wrangler versions upload`.

## Changelog

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
npm run test
npm run lint
npm run typecheck
```

## Legal TODO / Counsel Review Required

- privacy jurisdiction-specific language
- arbitration/limitation clauses
- minors policy wording
- official company legal contact metadata
