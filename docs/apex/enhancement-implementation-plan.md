# APEX Enhancement Implementation Plan

## Scope Chosen From Repo Evidence
This pass implemented enhancements only in verified modules: local storage write paths, local scripture retrieval, AI conversation orchestration, Cloudflare worker delivery, and tests/docs.

## Implemented Work
1. AI grounding and safety
   - Added bounded input normalization, scripture context limits, citation enforcement, fabricated-verse refusal, sensitive-counseling redirect, and ungrounded-answer labeling in `src/lib/agent/Grounding.ts`.
   - Integrated grounding into `src/lib/agent/ConversationOrchestrator.ts`.
   - Changed retrieval to bounded top-3 source assembly in `src/lib/agent/RetrievalOrchestrator.ts`.
   - Changed local retrieval to return no-match rather than random scripture fallback in `src/lib/adapters.ts`.

2. Idempotent local write paths
   - Added atomic list mutation helper in `src/lib/storage.ts`.
   - Deduplicated saved passages by stable scripture reference in addition to id.
   - Deduplicated batch saved passages and limited saved passage storage to 200 records.
   - Made journal retries update by id without duplicate rows and limited journal storage to 500 records.
   - Made safety-event logging duplicate-safe and bounded to the latest 100 events.

3. Reliability and observability
   - Added `/health` endpoint to `src/workers/static-spa.ts` with existing security headers.

4. Tests
   - Added deterministic AI grounding/safety tests in `src/test/ai-grounding.test.ts`.
   - Added local idempotency tests in `src/test/storage-idempotency.test.ts`.
   - Added worker health check test in `src/test/worker-health.test.ts`.
   - Updated retrieval test expectation for top-3 bounded context.

## Explicit Non-Goals
- No new runtime dependency.
- No new paid service or vendor.
- No database schema migration, because existing local-first and Supabase RLS/primary-key patterns support this pass without destructive changes.
- No broad UI rewrite.

### APEX-POWER-20X & OMNIDEV-V2 Architectural Upgrades

5. On-Device Prosody to Resonance Engine
   - Enhanced `audioAnalyzer.ts` to natively calculate clinical prosody metrics (dynamic range, speech rate, pause durations) without network cost.
   - Integrated a new context pipeline into `ResonanceEngine.ts` where evaluated prosody (elevated, flat, baseline) deterministically influences candidate content scoring.

6. Deterministic Groq NLU & Grounding
   - Refactored `GroqAdapter.ts` to strictly output `json_object` formats.
   - Implemented a local NLU intent-matching dictionary mapped against clinical CBT frameworks and scripture within `Grounding.ts` to completely eliminate generative AI drift.

7. Atomic CRDT-Inspired Sync Core
   - Added logical-timestamp resolution and wrapped database operations in `supabaseSync.ts` using the `CircuitBreaker` pattern to ensure conflict-free, offline-first data replication.
   - Proven deterministic via robust Concurrent Offline Edit Collision tests in `src/test/storage-idempotency.test.ts`.
