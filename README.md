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

Defaults are privacy-first. Raw audio is not stored by default. Transcripts are local-first and can be deleted.

## Environment Variables

### Frontend
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_GROQ_API_KEY` (optional)

### Optional/Infrastructure
- `CLOUDFLARE_ACCOUNT_ID` (CI deploy convenience)
- `CLOUDFLARE_API_TOKEN` (CI deploy)


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

```bash
npm ci
npm run build
npx wrangler deploy --config wrangler.json
```

CI-safe one-liner:

```bash
npm run deploy:ci
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
npm run test
npm run lint
npm run typecheck
```

## Legal TODO / Counsel Review Required

- privacy jurisdiction-specific language
- arbitration/limitation clauses
- minors policy wording
- official company legal contact metadata
