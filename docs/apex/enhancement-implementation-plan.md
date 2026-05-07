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
