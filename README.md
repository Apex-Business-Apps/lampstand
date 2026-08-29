# TheLampStand

*Version 2.1.0: Updated August 2026*

TheLampStand is a local-first, privacy-first Scripture companion built with React, TypeScript, and Vite. It is a non-profit community gift: never commercial, never paywalled, and never ad-supported.

---

## Architecture Overview

| Layer | Technology |
|---|---|
| UI | React 18 + Tailwind CSS + shadcn/ui |
| Routing | react-router-dom v7 (desktop side rail and mobile bottom navigation) |
| Auth | Supabase magic-link (guest mode preserved by default) |
| Persistence | localStorage-first typed modules in `src/lib/storage.ts`, which is the single trusted read and write boundary (ADR-012) |
| AI Provider | `src/lib/adapters.ts`: Groq primary (`GroqAIAdapter`) + local fallback |
| Agent Orchestration | `src/hooks/useAgentController.ts`: headless UI-agnostic runtime state |
| Agent Runtime | `src/lib/runtime/agentRuntime.ts`: safety gate, turn pipeline, retrieval, circuit breaker |
| Voice | `src/lib/voice.ts`: STT browser/null fallback, TTS cloud/browser/silent fallback |
| SEO & GEO | Schema.org JSON-LD graph (WebSite, Organization, WebApplication, FAQPage, HowTo, BreadcrumbList) + robots.txt AI crawler allowlist |
| PWA | `public/manifest.json` (`start_url` `/app`, standalone) + `public/sw.js` v5 offline shell |
| Deploy | Cloudflare Workers static assets via `wrangler.json` / `wrangler.production.toml` |

---

## Visual Layer Stack

The marketing page uses a custom canvas-based reveal system. Modal overlays are at **z-[500]** to guarantee they clear all canvas layers. See the full specification in [`docs/LAYER_STACK.md`](docs/LAYER_STACK.md).

---

## Modes

- **Guest mode**: full local usage, no login required.
- **Signed-in mode**: optional sync / account-linked persistence.

---

## Consent and Data Handling

All consent is explicit opt-in. Settings expose toggles for:

- Local adaptive memory and journal storage
- Optional cloud sync
- Microphone access
- Voice output (TTS)
- Notifications
- Gentle Mode (hides streak/gamification visuals for quiet focus)

Defaults are privacy-first. Raw audio is never stored. Transcripts are local-first and deletable. See [`MISSION.md`](MISSION.md) for the permanent non-monetization commitment.

---

## Content & Scripture Library

TheLampStand includes an extensive offline-first canonical library:

- **100+ Canonical Scripture Passages**: Spanning the Psalms, Gospels, Epistles, and Prophets with NABRE, ESV, and NIV text.
- **60+ Daily Light Morning Reflections**: Curated daily passages with short, empathetic pastoral reflections and prayers.
- **35+ Homiletic Sermons**: Structured teachings with reflections, modern relevance, and adaptive tone adjustments.
- **4-Step Benedictine Lectio Divina**: Sacred reading, meditation, prayer, and contemplation.
- **5-Step Ignatian Daily Examen**: Evening prayer review of gratitude, light, review, reconciliation, and resolution.
- **Pastoral Guidance Themes**: 16+ pastoral counseling themes with dedicated grounding passages and empathetic reflection prompts.

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

> [!WARNING]
> Never prefix server-side secrets with `VITE_`. Those values are bundled into client JS and are publicly visible.

---

## Cloudflare Deployment

**Local / staging** (uses `wrangler.json`):
```bash
npm ci && npm run build
npx wrangler deploy --config wrangler.json
```

**Production CI** (uses `wrangler.production.toml`: the authoritative production config used by GitHub Actions):
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
npm run test
npm run test:e2e
npm run build
```

Last verified on 2026-08-29: 49 Vitest suites (252 tests), 13 Playwright specs, ESLint with 0 errors and 0 warnings, and a clean production build. The current counts and the commands that produced them are recorded in `omni-recall/state/checkpoints/current-status.md`.

---

## Key Docs

| Document | Purpose |
|---|---|
| [`omni-recall/`](omni-recall/) | Institutional memory: architecture, decisions, constraints, debugging history, and content catalog |
| [`docs/LAYER_STACK.md`](docs/LAYER_STACK.md) | Authoritative z-index stack: read before touching any fixed/overlay element |
| [`docs/ROUTING_RULES.md`](docs/ROUTING_RULES.md) | Browser vs PWA routing bifurcation |
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

Ownership language references APEX Business Systems Ltd. (Edmonton, AB Canada).
