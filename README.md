# LampStand

*Version 2.1.0 — Updated: 2026-06-16*

LampStand is a local-first, privacy-first scripture companion built with React,
TypeScript, and Vite. It is a non-profit community gift — never commercial, never
paywalled, never ad-supported.

---

## Architecture Overview

| Layer | Technology |
|-------|-----------|
| UI | React 18 + Tailwind CSS + shadcn/ui |
| Routing | react-router v6 |
| Auth | Supabase magic-link (guest mode preserved by default) |
| Persistence | localStorage-first typed modules in `src/lib/storage.ts` |
| AI Provider | `src/lib/adapters.ts` — Groq primary (`GroqAIAdapter`) + local fallback |
| Agent Orchestration | `src/hooks/useAgentController.ts` — headless UI-agnostic runtime state |
| Agent Runtime | `src/lib/runtime/agentRuntime.ts` — safety gate, turn pipeline, retrieval, circuit breaker |
| Voice | `src/lib/voice.ts` — STT browser/null fallback, TTS cloud/browser/silent fallback |
| Deploy | Cloudflare Workers static assets via `wrangler.json` / `wrangler.production.toml` |

---

## Visual Layer Stack

The marketing page uses a custom canvas-based reveal system. Modal overlays are at
**z-[500]** to guarantee they clear all canvas layers. See the full specification in
[`docs/LAYER_STACK.md`](docs/LAYER_STACK.md).

---

## Modes

- **Guest mode** — full local usage, no login required
- **Signed-in mode** — optional sync / account-linked persistence

---

## Consent and Data Handling

All consent is explicit opt-in. Settings expose toggles for:

- Local adaptive memory & journal storage
- Optional cloud sync
- Microphone access
- Voice output (TTS)
- Notifications
- Gentle Mode (hides streak/gamification visuals — neurodivergent aligned)

Defaults are privacy-first. Raw audio is not stored. Transcripts are local-first and
deletable. See [`MISSION.md`](MISSION.md) for the non-monetization commitment.

---

## Environment Variables

### Frontend (build-time, bundled into client JS)
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

### CI / Infrastructure
```
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

### Supabase Edge Function Secrets (set in Dashboard > Edge Functions > Secrets)
```
GROQ_API_KEY         # groq-guidance edge function
ELEVENLABS_API_KEY   # elevenlabs-tts edge function
```

> ⚠️ **Never** prefix server-side secrets with `VITE_`. Those values are bundled
> into client JS and are publicly visible.

---

## Cloudflare Deployment

**Local / staging** (uses `wrangler.json`):
```bash
npm ci && npm run build
npx wrangler deploy --config wrangler.json
```

**Production CI** (uses `wrangler.production.toml` — the authoritative production config used by GitHub Actions and dry-run validation):
```bash
# Runs automatically via GitHub Actions on push to main.
# To trigger manually:
npm ci && npm run build
npx wrangler deploy --config wrangler.production.toml
```

---

## Install / Build / Test

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

---

## Key Docs

| Document | Purpose |
|----------|---------|
| [`docs/LAYER_STACK.md`](docs/LAYER_STACK.md) | Authoritative z-index stack — read before touching any fixed/overlay element |
| [`docs/ROUTING_RULES.md`](docs/ROUTING_RULES.md) | Browser vs PWA routing bifurcation — do not modify without founder sign-off |
| [`MISSION.md`](MISSION.md) | Non-monetization commitment and contribution guidelines |
| [`docs/ios-release-checklist.md`](docs/ios-release-checklist.md) | iOS App Store release process |
| [`docs/android-release-checklist.md`](docs/android-release-checklist.md) | Google Play release process |

---

## Legal and Compliance Routes

```
/legal
/legal/privacy
/legal/terms
/legal/acceptable-use
/legal/disclaimer
/legal/company
```

Ownership language references APEX Business Systems Ltd. with explicit
counsel-review markers where legal finalization is required.
