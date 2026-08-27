# TheLampStand System Constraints & Invariants

## 1. Product & Business Invariants
- **NEVER** introduce subscription paywalls, Stripe, ads, in-app purchases, or paid features.
- **NEVER** collect personal identifying information (PII), track user location, or send analytics telemetry.
- **NEVER** introduce runtime dependencies outside vetted, essential open-source packages in `package.json`.
- **NEVER** use em-dashes (—) or en-dashes (–) anywhere in UI copy, data libraries, or source text. Enforce natural commas, colons, or clean sentences.
- **NEVER** composite, fragment, or invent alternate logo icons: use exclusively `/images/wordmark-logo.png` for header branding.

## 2. Technical Performance Limits
- `MAX_AI_INPUT_CHARS = 1200`: User input normalization truncates at 1,200 characters in `src/lib/agent/Grounding.ts`.
- `MAX_CONTEXT_CHARS = 600`: Local guidance context assembly truncates at 600 characters in `src/lib/guidance/contextAssembler.ts`.
- `topK = 5`: Retrieval search bounds candidate passages between 1 and 5 in `src/lib/runtime/agentRuntime.ts` and `src/lib/adapters.ts`.
- `Local Storage Capacity`: Saved passages capped at 200 records, journal entries at 500 records, safety events at 100 records in `src/lib/storage.ts`.

## 3. Security & Safety Gates
- **Prompt Injection Detection**: `checkInputSafety()` in `src/lib/safety.ts` evaluates all incoming user prompts.
- **Guardrail Interceptors**: `getRequestGuardrail()` in `src/lib/agent/Grounding.ts` prevents fabricated scriptures and intercepts self-harm, domestic violence, medical diagnosis, and legal advice requests.
- **Circuit Breaker**: `shouldCircuitBreak()` fails closed to safe resting passage when consecutive safety violations occur.
- **Content Security Policy**: `src/workers/static-spa.ts` enforces strict CSP allowlisting Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), Supabase, and Groq.

## 4. Architectural Layer Stack (`docs/LAYER_STACK.md`)
- `z-[500]`: Fullscreen modals and consent dialogs.
- `z-[200]`: Hero text, headers, and below-fold interactive sections.
- `z-[150]`: Lampstand glowing canvas layer.
- `z-[100]`: Candle reveal canvas veil mask.
- `z-10` / `z-0`: Background cross silhouette and sacred texture layers.
