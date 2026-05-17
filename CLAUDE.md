# CLAUDE.md — LampStand Agent and Developer Reference

This file is the canonical onboarding document for AI coding agents (Claude Code, Jules, etc.) and new human contributors. Read it before touching any code. It describes what the project is, what is in the codebase, what must never be changed, and how to validate work.

---

## What This Project Is

LampStand is a **browser-based, local-first scripture companion** built as a non-profit community gift. It is a React 18 + TypeScript + Vite SPA deployed to Cloudflare Workers. It has no native mobile layer, no EPUB reader, no WebView bridge, and no React Native code.

Core surfaces: Daily Light, Guidance, Journal, Saved Passages, Sermon, Examen, Kids Mode, voice I/O, and personalization via the Resonance Engine.

Non-profit status is mission-locked. See `MISSION.md`.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18, TypeScript 5, Vite 6 |
| Routing | react-router-dom v6 |
| UI | Tailwind CSS 3, shadcn/ui (Radix primitives), lucide-react |
| State | React useState/useMemo + TanStack Query for Supabase fetches |
| Persistence | localStorage-first via `src/lib/storage.ts`; optional Supabase sync |
| AI | Groq (llama-3.3-70b-versatile) via `src/lib/groq.ts`; local fallback via `src/lib/adapters.ts` |
| Auth | Supabase magic-link; guest mode is the default and must always work |
| Deploy | Cloudflare Workers static assets (`wrangler.json`, `src/workers/static-spa.ts`) |
| Tests | Vitest + jsdom + Testing Library |

---

## Source Map (active modules only)

```
src/
  App.tsx                         Route table (all pages lazy-loaded)
  main.tsx                        React entry

  pages/
    HomePage.tsx                  Dashboard: streak, daily light hero, nav cards
    DailyLightPage.tsx            Today's scripture + reflection + prayer
    GuidancePage.tsx              Concern input -> AI guidance
    JournalPage.tsx               Local journal (CRUD)
    SavedPage.tsx                 Saved scripture passages
    SermonPage.tsx                Passage -> AI sermon reflection
    ExamenPage.tsx                Ignatian daily examen (5-step flow)
    KidsPage.tsx                  Kids mode simplified content
    SettingsPage.tsx              Consent toggles, profile, sync settings

  components/
    FullscreenAgent.tsx           Immersive AI guidance experience (burns-bush canvas)
    FloatingAgent.tsx             Minimized agent pill (triggers FullscreenAgent)
    AppShell.tsx                  Navigation shell
    ScriptureCard.tsx             Passage display with save/share actions
    ReflectionBlock.tsx           Styled reflection/prayer text blocks
    AgentPresence.tsx             Animated agent state indicator (idle/thinking/speaking/error)

  lib/
    storage.ts                    All localStorage I/O; single source of truth for local state
    supabaseSync.ts               Bidirectional cloud sync (optional; consent-gated)
    dailyLight.ts                 Daily passage selection (Resonance-ranked)
    safety.ts                     Input safety check, circuit breaker, fallback passage
    adapters.ts                   IAIAdapter + IRetrievalAdapter singletons; LocalAIAdapter
    groq.ts                       GroqAIAdapter (primary AI); STYLE_GUIDE + guidance prompts

    guidance/
      contextAssembler.ts         Assembles personal context (saved passages, journal,
                                  resonance fingerprint) for injection into guidance prompt

    runtime/
      agentRuntime.ts             ACTIVE runtime: SafetyGate -> Retrieval -> Resonance ranking
                                  -> assembleGuidanceContext -> GroqAIAdapter -> GuidanceResult
                                  Used by GuidancePage.tsx and FullscreenAgent.tsx

    resonance/
      ResonanceEngine.ts          Spiritual fingerprint: theme affinity, season inference,
                                  sentiment, novelty-aware ranking. Powers Daily Light
                                  personalization and guidance passage selection.

    voice/                        Voice I/O adapters
    voice.ts                      STT/TTS singletons
    audioAnalyzer.ts              Amplitude analyzer for canvas animations
    dailyLight.ts                 Daily Light selection with history-aware dedup
    date.ts                       Local-date formatting helpers
    utils.ts                      cn() and other UI utilities
    notifications/                Push notification scheduler

    agent/                        ORPHANED runtime stack — do not extend or consume
      ConversationOrchestrator.ts
      SafetyGate.ts
      Grounding.ts
      RetrievalOrchestrator.ts
      CircuitBreaker.ts
      Prompts.ts
      AgentInterfaces.ts

    ai/                           ORPHANED adapter stack — do not extend or consume
      AgentRuntime.ts
      GroqAdapter.ts
      NullAdapter.ts
      types.ts

  data/
    contentLibrary.ts             Scripture passage library + daily light templates
    seed.ts                       Seed sermons for local fallback

  hooks/
    useAuth.tsx                   Supabase auth state
    useAppBoot.ts                 On-mount: hydrate Resonance fingerprint + arm notifications

  integrations/supabase/          Generated Supabase client and types
  workers/
    static-spa.ts                 Cloudflare Worker: security headers, /health endpoint, SPA fallback
```

---

## The Orphaned Runtime Stack

`src/lib/ai/AgentRuntime.ts` and `src/lib/agent/ConversationOrchestrator.ts` are **not consumed by any page or component**. They were written during a previous enhancement pass and never wired in. They contain better pastoral prompts (`Prompts.ts`) and stronger grounding logic (`Grounding.ts`) than what the active runtime uses, but connecting them requires bridging the return type mismatch (`TurnResult { response: string }` vs `GuidanceResult` with structured fields).

**Do not delete this stack yet.** Consolidation is Phase 2 of the roadmap.
**Do not add new callers of `src/lib/ai/AgentRuntime.ts`** without first reconciling the type mismatch.
**Do not use `src/lib/agent/Prompts.ts` directly in new features** without verifying it against the style guide in `src/lib/groq.ts` (`STYLE_GUIDE` constant).

---

## Invariants — Never Break These

### 1. Guest mode must always work
- All pages must render and be usable without a Supabase session.
- `getProfile()` and all `storage.ts` reads return `null` or a default gracefully.
- The Guidance and Daily Light flows must produce output with no auth.

### 2. Consent flags must be respected
The `ConsentState` in storage has `localAdaptiveMemory`, `localJournalStorage`, `optionalCloudSync`, and others. Any code that reads user history, journal entries, or saved passages for AI/personalization purposes must check consent first. The `assembleGuidanceContext()` function in `src/lib/guidance/contextAssembler.ts` is the reference implementation.

### 3. Safety checks are mandatory on all user input
Before any user text reaches the AI layer, it must pass through the safety gate. The active path in `TurnPipeline.runGuidanceTurn()` does this. Never bypass or reorder the safety check. The circuit breaker must remain active.

### 4. `GuidanceResult` is the canonical structured type for guidance responses
The type lives in `src/types/index.ts`. All guidance surfaces (GuidancePage, FullscreenAgent) expect `{ passage, pastoralFraming, reflectionQuestions, prayer, themes, concern, id, createdAt }`. Do not change this type without updating all callers.

### 5. Storage keys are stable contracts
The `KEYS` object in `src/lib/storage.ts` defines all localStorage keys. Renaming a key is a breaking migration — existing users will lose data. Adding a new key is safe. Renaming requires a migration reader at startup.

### 6. No introduction of native mobile, EPUB, or WebView code
This is a browser SPA. Do not introduce React Native, Expo, epub.js, WebView bridges, or any native-only API. See research mismatch notes in `docs/apex/repo-inventory.md`.

### 7. Mission lock
No Stripe, no in-app purchases, no advertising SDKs, no paywalls, no behavior-monetizing analytics. See `MISSION.md`.

---

## Anti-Patterns (Do Not Do These)

- **Do not call `localStorage` in the main render body of components with high-frequency state.** Use `useMemo` or lazy `useState` initializers. See `.jules/bolt.md`.
- **Do not add `target="_blank"` links without `rel="noopener noreferrer"`.** See `.jules/sentinel.md`.
- **Do not discard retrieval results.** The previous pattern `await retrieval.retrieve(input)` without using the return value was a bug that has been fixed. If you retrieve, use the result.
- **Do not duplicate the safety check.** `TurnPipeline` already checks. `FullscreenAgent` also checks before calling the runtime (belt-and-suspenders). Do not add a third redundant check in `groq.ts`.
- **Do not describe features that don't exist in documentation.** The `docs/apex/enhancement-implementation-plan.md` file was deleted because it described prosody-to-resonance integration, CRDT sync, and CBT NLU dictionary features that were never implemented. Docs must describe reality.
- **Do not extend the orphaned runtime stack** (`src/lib/ai/`, `src/lib/agent/`). It is not wired to any UI surface.
- **Do not write multi-paragraph comments or docstrings** in source files. One line max when the WHY is non-obvious.
- **Do not commit `.env` files or secrets.** `VITE_GROQ_API_KEY` goes in `.env.local` locally and as a CI secret for deployment.

---

## Validation Commands

Run these before every commit. All must pass.

```bash
npm run typecheck    # tsc --noEmit
npm run test         # vitest run (97 tests as of 2026-05-17)
npm run lint         # eslint .
npm run build        # vite build (production bundle)
```

One-liner:
```bash
npm run typecheck && npm run test && npm run lint && npm run build
```

---

## Adding New Features

### New AI-generated content type
1. Add a type to `src/types/index.ts` and method to `IAIAdapter` if it's a new content surface.
2. Add the method to `LocalAIAdapter` (fallback) and `GroqAIAdapter` (Groq path) in `adapters.ts` / `groq.ts`.
3. Respect the style guide: copy `STYLE_GUIDE` from `groq.ts` and add a mode-specific section.
4. If the new content uses user history, gate it through `getConsentState().localAdaptiveMemory` using the pattern in `contextAssembler.ts`.
5. Add a focused test.

### New storage field
1. Add the key to `KEYS` in `storage.ts`.
2. Provide a read function and a write function following existing patterns.
3. If this data should sync to Supabase for authenticated users, add push/pull functions to `supabaseSync.ts` and include them in `runFullSync()`.
4. Add the new key to `resetAllData()`.

### New page
1. Lazy-import it in `App.tsx` and add a `<Route>`.
2. Wrap in `<AppShell>` for consistent navigation.
3. Add a route constant to `src/test/routes.test.ts` if it should be reachability-tested.

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | Build-time, `.env.local` / CI secret | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Build-time, `.env.local` / CI secret | Supabase anon key |
| `VITE_GROQ_API_KEY` | Build-time, `.env.local` / CI secret | Groq API key; omit to run local-only (no LLM) |

`VITE_*` variables are bundled into client JS. They are intended to be public. Do not put secrets here that are not safe to expose in browser source.

---

## Deploy

```bash
# Dev
npm run dev

# Staging (local deploy config)
npm run build && npx wrangler deploy --config wrangler.json

# Production
npm run build && npx wrangler deploy --config wrangler.production.json

# CI one-liner
npm run deploy:ci
```

See `docs/cloudflare-domain-cutover.md` for DNS/TLS setup and GitHub Actions secrets.

---

## Test Writing Guidelines

- Tests live in `src/test/`.
- Mock `localStorage` via `localStorage.clear()` and direct `localStorage.setItem()` calls in `beforeEach`. The jsdom environment provides `localStorage`.
- Mock the Groq `fetch` via `vi.spyOn` on the `ask` private method (see `src/test/groq.test.ts`).
- Mock AI adapters via `setAIAdapter()` / `setRetrievalAdapter()` from `src/lib/adapters.ts` (see `src/test/ai-grounding.test.ts`).
- Reset Resonance fingerprint with `resetFingerprint()` from `ResonanceEngine` in `beforeEach` when resonance state matters.
- Do not write tests that depend on network calls. Every test must be deterministic offline.

---

## Key Architectural Decision Log

| Decision | Rationale |
|----------|-----------|
| localStorage-first persistence | Instant reads, no auth required, works offline, respects privacy defaults |
| Groq via direct fetch (not SDK) | Minimal bundle size; the API is simple enough that the SDK adds no value here |
| `IAIAdapter` interface | Allows swapping Groq -> local -> null without changing callers; enables clean testing |
| Resonance Engine (no ML model) | Pure TypeScript, zero dependency, bounded memory, explains its own ranking decisions |
| ConversationOrchestrator orphaned (not deleted) | It contains better prompts and grounding; Phase 2 will reconcile the type mismatch and adopt it |
| `wrangler.json` vs `wrangler.production.json` | Staging deploys without domain routes; production adds custom domain route bindings |
