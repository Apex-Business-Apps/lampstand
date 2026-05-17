# Performance Report

Last updated: 2026-05-17

---

## Active Runtime Bounds (Phase 1, 2026-05-17)

- Guidance retrieval: `RetrievalOrchestrator.retrieve()` in `agentRuntime.ts` requests `topK: 5` candidates from `LocalRetrievalAdapter`. These are Resonance-ranked and the top candidate is used. Previously this call returned 1 passage and discarded it.
- Context assembly: `assembleGuidanceContext()` in `contextAssembler.ts` caps output at 600 characters. Journal excerpts are truncated to 90 characters each; at most 3 excerpts and 5 passage refs are included. The full assembly is a synchronous localStorage read — no network, no async.
- Groq guidance call: `generateGuidanceWithContext()` in `groq.ts` sets `max_completion_tokens: 900` for guidance responses (down from 1000 in the prior pass).

---

## Grounding Stack Bounds (prior pass, 2026-05-07)

- AI input normalized and capped at 1,200 characters in `src/lib/agent/Grounding.ts`.
- AI scripture context capped to 3 passages and 1,800 context characters in `src/lib/agent/Grounding.ts`.
- Retrieval bounded to top 3 in `src/lib/agent/RetrievalOrchestrator.ts`.
- Local retrieval caps `topK` between 1 and 5 in `src/lib/adapters.ts`.

---

## Storage Bounds

- Saved passages bounded to 200 local records in `src/lib/storage.ts`.
- Journal entries bounded to 500 local records in `src/lib/storage.ts`.
- Safety events bounded to the latest 100 records with duplicate prevention in `src/lib/storage.ts`.
- Voice history capped to 50 transcripts, each truncated to 1,000 characters in `src/lib/storage.ts`.

---

## Infrastructure

- `/health` endpoint returns before static asset lookup in `src/workers/static-spa.ts` — no asset read on health checks.
- All pages are lazy-loaded via `React.lazy()` in `src/App.tsx` — initial bundle is split across route-level chunks.

---

## Dependency and Bundle Impact

- No runtime dependency added in any pass.
- All new code is local TypeScript; zero network cost at import time.
- Build completed successfully with Vite; bundle sizes unchanged from baseline.
