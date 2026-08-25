# Security Hardening Report

## Controls Implemented
- Input normalization and character cap (`MAX_AI_INPUT_CHARS = 1200`) is enforced by `src/lib/agent/Grounding.ts`.
- Prompt-injection resistance is enforced by `src/lib/safety.ts` (`checkInputSafety`) and `SafetyGate` in `src/lib/runtime/agentRuntime.ts`.
- Fabricated scripture requests are blocked before provider execution in `src/lib/agent/Grounding.ts`.
- Sensitive counseling, emergency, medical, and legal replacement risks are redirected before provider execution in `src/lib/agent/Grounding.ts`.
- Ungrounded AI answers are explicitly labeled as not verified from LampStand source passages in `src/lib/runtime/agentRuntime.ts` and `src/lib/agent/Grounding.ts`.
- Circuit breaker (`src/lib/safety.ts`, `shouldCircuitBreak`) fails closed to safe resting passage on repeated safety incidents.
- Cloudflare worker health responses receive the same security headers as assets in `src/workers/static-spa.ts`.
- Local write paths deduplicate retry submissions in `src/lib/storage.ts`.

## Controls Verified
- CSP, HSTS, frame-options, content-type, referrer, and permissions headers are configured in `src/workers/static-spa.ts`.
- SPA deep-link fallback returns `200 OK` for valid non-asset routes.
- Supabase RLS policies for user-owned profiles, saved passages, and journal entries are configured under `supabase/migrations/`.
- Admin route is guarded by `src/components/AuthGuard.tsx` in `src/App.tsx`.

## Tests Added & Verified
- `src/test/ai-grounding.test.ts` covers citations, fabricated scripture refusal, sensitive counseling redirect, and ungrounded labeling.
- `src/test/safety.test.ts` and `src/test/circuit.test.ts` cover injection detection and circuit breaking.
- `src/test/storage-idempotency.test.ts` covers duplicate-safe local writes.
- `src/test/worker-health.test.ts` covers health response security headers.
