# TheLampStand Enhancement Implementation Plan

## Scope Chosen From Repo Evidence
This pass implemented enhancements in verified live modules: local storage write paths, local scripture retrieval, AI agent runtime pipeline (`src/lib/runtime/agentRuntime.ts`), Resonance engine, Cloudflare worker delivery, and test/docs reconciliations.

## Implemented Work
1. AI grounding and safety
   - Enforced input normalization and cap (`MAX_AI_INPUT_CHARS = 1200`), citation verification, fabricated-verse refusal, and sensitive-counseling redirect in `src/lib/agent/Grounding.ts`.
   - Unified agent turn execution in `src/lib/runtime/agentRuntime.ts` (`AgentRuntime`, `TurnPipeline`).
   - Standardized context assembly cap (`MAX_CONTEXT_CHARS = 600`) in `src/lib/guidance/contextAssembler.ts`.
   - Reconciled UI state machine into single canonical hook `src/hooks/useAgentController.ts` consumed by `src/components/FullscreenAgent.tsx` and `src/pages/GuidancePage.tsx`.

2. Idempotent local write paths
   - Added atomic list mutation helper in `src/lib/storage.ts`.
   - Deduplicated saved passages by stable scripture reference in addition to id.
   - Bounded saved passage storage to 200 records and journal entries to 500 records.
   - Bounded safety-event logging to latest 100 events with duplicate prevention.

3. Reliability and observability
   - Added `/health` endpoint to `src/workers/static-spa.ts` with security headers.
   - Clean dynamic configuration resolution in `src/lib/groq.ts`.

4. Tests
   - Verified deterministic AI grounding and safety in `src/test/ai-grounding.test.ts`, `src/test/safety.test.ts`, and `src/test/ai-guardrails.test.ts`.
   - Verified local idempotency in `src/test/storage-idempotency.test.ts`.
   - Verified worker health in `src/test/worker-health.test.ts`.

## Explicit Non-Goals
- No new runtime dependency.
- No new paid service or vendor.
- No database schema migration.
- No paywalls or PII telemetry.

### Architectural Features
5. On-Device Resonance Engine
   - `src/lib/resonance/ResonanceEngine.ts`: pure TypeScript, zero-dependency, local-first adaptive ranker that re-ranks candidate content based on life-season, theme affinity, and pastoral care rules.

6. Bounded Structured Guidance
   - `src/lib/groq.ts`: structured guidance output with fallback to `LocalAIAdapter` in `src/lib/adapters.ts`.
