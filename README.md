# LampStand

LampStand is a local-first scripture and guidance companion with optional authentication and optional cloud sync.

## Architecture overview

- **UI Layer**: React + Vite + Tailwind pages for onboarding, Daily Light, guidance, sermon mode, kids mode, saved passages, journal, settings, legal, and auth.
- **Runtime Layer**: `AgentRuntime` + `TurnPipeline` + `ConversationOrchestrator` + `RetrievalOrchestrator` + `SafetyGate` + `SessionStateMachine` + `CircuitBreaker`.
- **Provider Layer**: vendor-agnostic `AIProviderAdapter` routing to Groq first when configured, then local fallback, then scripture-only safe fallback.
- **Voice Layer**: STT/TTS adapters with browser-native first, null/silent fallback.
- **Storage Layer**: localStorage-first persistence for profile, consent, journal, saved passages, safety events, and local memory.

## Auth model

- **Guest mode**: available by default, no forced sign-in.
- **Email magic link**: Supabase OTP sign-in.
- **Google sign-in**: Supabase OAuth sign-in.

## Privacy and compliance behavior

- Local-first storage is default.
- Raw audio is never stored by default.
- Transcript preview is shown before submit.
- Transcripts stay local by default.
- Cloud sync is explicit opt-in only.
- Legal routes are included:
  - `/legal/privacy`
  - `/legal/terms`
  - `/legal/aup`
  - `/legal/disclaimer`
- Counsel review markers use `TODO/UNCERTAIN` language where applicable.

## Environment variables

Create `.env` with:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GROQ_API_KEY=
VITE_GROQ_MODEL=llama-3.1-8b-instant
```

## Local setup

```bash
npm ci
npm run dev
```

## Tests and quality

```bash
npm run lint
npm run test
npm run build
```

## Cloudflare deployment

- `wrangler.toml` is explicit and does not depend on auto-detection.
- SPA fallback is defined in `public/_redirects`.
- Deploy commands:

```bash
npm run deploy:cloudflare
# or CI-friendly
npm run deploy:cloudflare:ci
```

## Legal/compliance notes

This repository includes baseline legal and licensing surfaces for APEX Business Systems LTD.
Final legal text and jurisdictional terms require counsel review before general release.
