# LampStand

LampStand is a local-first, browser-based scripture companion built as a non-profit community gift. It is a React 18 + TypeScript + Vite SPA deployed to Cloudflare Workers. There is no native mobile layer, no EPUB reader, and no React Native code.

See `MISSION.md` for the non-profit mission lock and contributor constraints.
See `CLAUDE.md` for the full developer and agent onboarding reference.

---

## Architecture Overview

| Layer | Technology |
|-------|-----------|
| UI | React 18, Tailwind CSS, shadcn/ui (Radix), lucide-react |
| Routing | react-router-dom v6 (all pages lazy-loaded) |
| State | React hooks + TanStack Query |
| Persistence | localStorage-first (`src/lib/storage.ts`); optional Supabase cloud sync |
| AI | Groq llama-3.3-70b-versatile (`src/lib/groq.ts`); local fallback (`src/lib/adapters.ts`) |
| Personalization | Resonance Engine (`src/lib/resonance/ResonanceEngine.ts`) — on-device spiritual fingerprint |
| Auth | Supabase magic-link; guest mode is the default and always works without login |
| Deploy | Cloudflare Workers static assets (`wrangler.json`) |
| Tests | Vitest + jsdom |

---

## Product Surfaces

- **Daily Light** — Today's scripture passage, personalized by the Resonance Engine
- **Guidance** — Concern input -> AI pastoral response grounded in the user's saved passages, journal excerpts, and spiritual season
- **Journal** — Local journal entries
- **Saved Passages** — Scripture passage library
- **Sermon** — Passage -> AI sermon reflection
- **Daily Examen** — Ignatian 5-step evening prayer
- **Kids Mode** — Simplified content for children
- **Voice I/O** — Browser STT input, cloud/browser TTS output

---

## Key Modules

```
src/lib/
  storage.ts                  All localStorage I/O — single source of truth for local state
  groq.ts                     GroqAIAdapter — primary AI provider with pastoral style guide
  adapters.ts                 IAIAdapter / IRetrievalAdapter singletons; LocalAIAdapter fallback
  safety.ts                   Input safety, circuit breaker, safe fallback passage
  dailyLight.ts               Daily passage selection with Resonance ranking + history dedup
  supabaseSync.ts             Optional bidirectional Supabase cloud sync
  guidance/
    contextAssembler.ts       Assembles saved passages, journal excerpts, and Resonance
                              fingerprint into a context block for the guidance AI prompt
  runtime/
    agentRuntime.ts           Active guidance runtime: safety -> retrieval -> Resonance ranking
                              -> context assembly -> GroqAIAdapter -> GuidanceResult
  resonance/
    ResonanceEngine.ts        Spiritual fingerprint: theme affinity, season, sentiment,
                              novelty. Used by Daily Light, Guidance, and Examen surfaces.
```

> **Orphaned runtime stack**: `src/lib/ai/AgentRuntime.ts` and `src/lib/agent/ConversationOrchestrator.ts` exist but are not connected to any page. They contain stronger prompts and grounding logic slated for Phase 2 consolidation. Do not add new callers. See `CLAUDE.md`.

---

## Modes

- **Guest mode** — Full local usage; no login required; all core features work
- **Signed-in mode** — Optional Supabase sync for profile, saved passages, and journal; daily light history dedup across sessions

---

## Consent and Privacy

Settings include explicit opt-in toggles for local adaptive memory, local journal storage, optional cloud sync, notifications, microphone, voice output, and account-linked persistence. All defaults are privacy-first. Personal context assembly for AI guidance is gated behind the `localAdaptiveMemory` consent flag.

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon key |
| `VITE_GROQ_API_KEY` | No | Groq API key; omit to run local-only with no LLM calls |

`VITE_*` variables are bundled into client JavaScript and are public by design. Do not store sensitive non-public secrets here.

**Local development**: put variables in `.env.local` (git-ignored).
**CI/Production**: store as repository secrets; export before `npm run build`.

---

## Install / Build / Test

```bash
npm ci
npm run typecheck    # tsc --noEmit
npm run test         # vitest run
npm run lint         # eslint .
npm run build        # vite build
```

All four must pass before merging any change.

---

## Deploy

```bash
# Staging (no domain routes)
npm run build && npx wrangler deploy --config wrangler.json

# Production (thelampstand.icu)
npm run build && npx wrangler deploy --config wrangler.production.json

# CI one-liner
npm run deploy:ci
```

See `docs/cloudflare-domain-cutover.md` for full DNS/TLS setup and GitHub Actions secrets.

---

## Legal Routes

```
/legal           /legal/privacy     /legal/terms
/legal/acceptable-use              /legal/disclaimer    /legal/company
```

Ownership references APEX Business Systems LTD. Jurisdiction-specific clauses require counsel review before production use.
