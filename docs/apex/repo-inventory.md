# LampStand Repo Inventory

Verified on 2026-05-17.

## Stack

- Framework: Vite 6 React SPA verified by `vite.config.ts`, `src/main.tsx`, `src/App.tsx`.
- Language: TypeScript 5 verified by `tsconfig.json`.
- Package manager: npm 10.9.2 verified by `package.json` `packageManager` field.
- Runtime/deploy target: Cloudflare Workers static assets verified by `wrangler.json`, `wrangler.jsonc`, `src/workers/static-spa.ts`.
- Build script: `npm run build` -> `vite build`.
- Test script: `npm test` -> `vitest run` (97 tests as of 2026-05-17).
- Lint script: `npm run lint` -> `eslint .`.
- Typecheck script: `npm run typecheck` -> `tsc --noEmit`.

## Source Structure

### Active AI / Runtime stack (what the UI actually uses)

- `src/lib/runtime/agentRuntime.ts` — ACTIVE runtime. `TurnPipeline.runGuidanceTurn()` is the single entry point for guidance generation. Wired to `GuidancePage.tsx` and `FullscreenAgent.tsx`.
- `src/lib/groq.ts` — `GroqAIAdapter` with `generateGuidanceWithContext()`. Uses `STYLE_GUIDE` for all Groq calls.
- `src/lib/adapters.ts` — `IAIAdapter` / `IRetrievalAdapter` singleton factories; `LocalAIAdapter` fallback.
- `src/lib/guidance/contextAssembler.ts` — Assembles `GuidanceContext` from localStorage and Resonance fingerprint for injection into guidance system prompt. Consent-gated.

### Orphaned AI / Runtime stack (not wired to any page — Phase 2 consolidation target)

- `src/lib/ai/AgentRuntime.ts` — Not consumed by any page.
- `src/lib/ai/GroqAdapter.ts`, `src/lib/ai/NullAdapter.ts`, `src/lib/ai/types.ts`
- `src/lib/agent/ConversationOrchestrator.ts`, `src/lib/agent/SafetyGate.ts`
- `src/lib/agent/Grounding.ts`, `src/lib/agent/Prompts.ts`
- `src/lib/agent/RetrievalOrchestrator.ts`, `src/lib/agent/CircuitBreaker.ts`, `src/lib/agent/AgentInterfaces.ts`

Do not add new callers to the orphaned stack. See `CLAUDE.md`.

### App entry and routes

- `src/main.tsx`, `src/App.tsx`, `src/pages/`

### UI components

- `src/components/`, `src/components/ui/`, `src/hooks/`, `src/index.css`, `src/App.css`
- Key: `FullscreenAgent.tsx`, `FloatingAgent.tsx`, `AppShell.tsx`, `ScriptureCard.tsx`, `ReflectionBlock.tsx`, `AgentPresence.tsx`

### Scripture / Content modules

- `src/data/contentLibrary.ts`, `src/data/seed.ts`, `src/lib/dailyLight.ts`, `src/components/ScriptureCard.tsx`

### Personalization

- `src/lib/resonance/ResonanceEngine.ts` — On-device Resonance fingerprint (theme affinity, season inference, sentiment, novelty ranking). Used by Daily Light selection, Guidance passage ranking, and signal recording.

### Auth / Session modules

- `src/hooks/useAuth.tsx`, `src/contexts/AuthContext.tsx`, `src/components/AuthGuard.tsx`
- `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`

### Data / Persistence modules

- `src/lib/storage.ts`, `src/lib/supabaseSync.ts`, `supabase/migrations/`

### Voice modules

- `src/lib/voice.ts`, `src/lib/voice/`, `src/components/VoiceInput.tsx`, `src/lib/audioAnalyzer.ts`

### Other

- `src/lib/notifications/dailyReminder.ts` — Push notification scheduler
- `src/lib/examen/` — Ignatian examen flow
- `src/lib/safety.ts` — Input safety, circuit breaker (active path)
- `src/lib/date.ts`, `src/lib/utils.ts`
- `src/hooks/useAppBoot.ts` — Boot-time Resonance hydration + notification arm

### Worker and infrastructure

- `src/workers/static-spa.ts` — Cloudflare Worker: security headers, `/health` endpoint, SPA fallback
- `wrangler.json` — Staging deploy config
- `wrangler.production.json` — Production deploy config with domain routes
- `wrangler.jsonc` — Reference / legacy config

### Tests

- `src/test/` — 25 test files, 97 tests (Vitest + jsdom)

## Verified Capabilities

- Scripture / content: `src/data/contentLibrary.ts`, `src/data/seed.ts`, `src/lib/adapters.ts`
- AI guidance: `src/lib/runtime/agentRuntime.ts`, `src/lib/groq.ts`, `src/pages/GuidancePage.tsx`, `src/components/FullscreenAgent.tsx`
- Contextual guidance memory: `src/lib/guidance/contextAssembler.ts` (Phase 1, 2026-05-17)
- Resonance personalization: `src/lib/resonance/ResonanceEngine.ts`
- Daily Light: `src/lib/dailyLight.ts` with Resonance ranking and Supabase history dedup
- Journaling: `src/pages/JournalPage.tsx`, `src/lib/storage.ts`
- Sermon: `src/pages/SermonPage.tsx`, `src/data/seed.ts`
- Daily Examen: `src/pages/ExamenPage.tsx`, `src/lib/examen/`
- Calendar / streak / reminder: `src/lib/storage.ts`, `src/lib/date.ts`, `src/lib/notifications/dailyReminder.ts`
- Sharing: `src/pages/DailyLightPage.tsx`, `src/components/ScriptureCard.tsx`
- PWA / offline support: `src/pages/InstallPage.tsx`, `public/manifest.json`, `public/sw.js`
- Health check: `src/workers/static-spa.ts` `/health` endpoint
- Admin / content roles: `src/pages/AdminPage.tsx`, `src/hooks/useAdminRole.ts`, migration `20260410034137_...sql`
- Optional Supabase cloud sync: `src/lib/supabaseSync.ts`

## Unverified / Not Present

- EPUB parsing, EPUB reader, native mobile (React Native / Expo): NOT in this repository.
- Hosted vector database or embeddings: NOT in this repository.
- Referral event persistence: NOT found in repository.
- Prosody-to-Resonance integration: `src/lib/audioAnalyzer.ts` computes amplitude only; no clinical prosody pipeline exists.
- CRDT-inspired sync: `src/lib/supabaseSync.ts` uses simple upsert patterns; no CRDT implementation exists.
- Playwright e2e specs: `playwright.config.ts` exists; no spec files found as of this audit.

## Dependencies

Dependencies verified from `package.json` only. No new runtime dependency added in Phase 1. Key runtime deps: React, React Router, TanStack React Query, Supabase JS, Radix UI, zod, date-fns, react-markdown, recharts, lucide-react, sonner.
