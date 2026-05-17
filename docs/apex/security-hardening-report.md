# Security Hardening Report

Last updated: 2026-05-17

---

## Controls Implemented

### Input and Prompt Safety

- Prompt-injection resistance enforced in `src/lib/safety.ts` (`checkInputSafety()`) via 10 injection patterns covering override, jailbreak, role-play, and system-prompt extraction requests.
- Duplicate protection in `src/lib/agent/SafetyGate.ts` (orphaned stack) covering 16 injection patterns.
- Fabricated scripture requests blocked before model execution in `src/lib/agent/Grounding.ts` (`getRequestGuardrail()`).
- Sensitive counseling, emergency, medical, legal, and self-harm requests redirected to appropriate support messaging in `src/lib/agent/Grounding.ts` before any AI call.
- Input normalization and 1,200-character cap prevent oversized prompt attacks in `src/lib/agent/Grounding.ts`.

### Output Safety

- Post-generation banned phrase filter in `src/lib/runtime/agentRuntime.ts` blocks AI filler and em dashes that slip through the system prompt.
- Ungrounded AI answers explicitly labeled as unverifiable from LampStand sources in `src/lib/agent/Grounding.ts`.
- Output em dash cleaning in `src/lib/agent/SafetyGate.ts` (`cleanOutput()`).

### Personal Context Privacy

- `src/lib/guidance/contextAssembler.ts` gates all personal context assembly (saved passages, journal excerpts, Resonance fingerprint) behind `consent.localAdaptiveMemory`. Returns null with no localStorage reads beyond the consent key when consent is denied.
- Context output is hard-truncated at 600 characters and includes an instruction prohibiting the model from revealing or citing the context to the user.
- All localStorage reads in `contextAssembler.ts` are wrapped in try/catch; private browsing mode and quota errors silently return null without blocking the request.

### Circuit Breaker

- `shouldCircuitBreak()` in `src/lib/safety.ts` opens the circuit after 5 safety events within 5 minutes, routing all guidance requests to the safe fallback passage without reaching the AI provider.

### Infrastructure

- CSP, HSTS, frame, content-type, referrer, and permissions headers applied to all responses in `src/workers/static-spa.ts`.
- Health endpoint at `/health` returns same security headers as all other responses.
- Admin route guarded by `AuthGuard` in `src/App.tsx`.

---

## Supabase RLS Controls

Row-level security policies for user-owned data exist in `supabase/migrations/`:

- Profiles: user can read/write only their own row.
- Saved passages: user can read/write only their own rows.
- Journal entries: user can read/write only their own rows.
- Daily light history: user can read/write only their own rows.
- Roles: admin-only write access; read by authenticated users.

---

## Tests

- `src/test/ai-grounding.test.ts`: Citation enforcement, fabricated verse rejection, sensitive counseling redirect, ungrounded answer labeling.
- `src/test/safety.test.ts`: Injection blocking, banned phrase detection, em dash cleaning.
- `src/test/runtime.test.ts`: Pipeline injection block, circuit breaker.
- `src/test/storage-idempotency.test.ts`: Duplicate-safe local writes.
- `src/test/worker-health.test.ts`: Health response security headers.
- `src/test/guidance-context.test.ts`: Consent gating, null safety on localStorage failure, context truncation.
