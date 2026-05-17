# AI Safety and Grounding Report

Last updated: 2026-05-17

---

## Active Safety Stack (wired to all UI surfaces)

The active guidance runtime lives in `src/lib/runtime/agentRuntime.ts`. All guidance requests from `GuidancePage.tsx` and `FullscreenAgent.tsx` pass through `TurnPipeline.runGuidanceTurn()`.

### Input controls

1. **Circuit breaker** (`shouldCircuitBreak()` in `src/lib/safety.ts`): After 5 safety events within a 5-minute window, all guidance requests return the safe fallback passage (Psalm 46:10) without reaching the AI provider.
2. **Input safety gate** (`checkInputSafety()` in `src/lib/safety.ts`): Scans for prompt injection, abuse language, and out-of-scope requests before any AI call. Matching inputs are blocked and return a safe fallback GuidanceResult.
3. **Fabricated scripture guard** (`getRequestGuardrail()` in `src/lib/agent/Grounding.ts`): Blocks requests asking the AI to invent, rewrite, or fake Bible verses. (Currently in orphaned stack but enforced at orchestrator level for tests.)

### Output controls

4. **Banned phrase filter** (`TurnPipeline`, `agentRuntime.ts`): After AI response generation, a regex scan blocks AI filler phrases ("Absolutely", "Certainly", "I hear you", em dashes, etc.). Matched responses fall back to a neutral instruction.
5. **Sensitive counseling redirect** (`getRequestGuardrail()` in `Grounding.ts`): Matches self-harm, abuse, medical, and legal replacement patterns and redirects to emergency/professional support language before model execution.

### Prompt-level controls

6. **Style guide** (`STYLE_GUIDE` in `src/lib/groq.ts`): All Groq calls use an explicit system prompt that prohibits AI filler, em dashes, therapy-speak, and vague comfort language.
7. **Guidance mode rules** (`GUIDANCE_JSON_RULES` in `src/lib/groq.ts`): Structures the AI response into pastoral beats (acknowledge, scripture, reflection, questions, prayer) and prohibits promising divine solutions to specific problems.

---

## Personal Context Assembly Safety

`src/lib/guidance/contextAssembler.ts` assembles saved passages, journal excerpts, and the Resonance fingerprint into a context block injected into the guidance system prompt.

- **Consent gate**: `assembleGuidanceContext()` returns null immediately if `consent.localAdaptiveMemory` is false. No user history reaches the AI prompt without explicit opt-in.
- **Null safety**: If localStorage throws (private mode, quota exceeded, corrupted data), the function catches the error and returns null. The guidance path continues without context.
- **Bounded output**: The formatted context string is hard-truncated at 600 characters to prevent context flooding that could displace grounding passages.
- **No reveal instruction**: The formatted context ends with an explicit instruction telling the model not to reference or explain the context to the user.

---

## Grounding Stack (orphaned — not currently wired to UI, tested in isolation)

The `src/lib/agent/` directory contains a second, stronger grounding implementation that is not yet connected to any page. It is tested by `src/test/ai-grounding.test.ts`.

- `SafetyGate.ts`: Blocks 16 injection patterns; validates output against 11 banned phrase/character patterns; cleans em dashes.
- `Grounding.ts`: Input normalization, fabricated verse refusal, sensitive counseling redirect, 3-passage bounded grounding context, citation enforcement on all answers.
- `ConversationOrchestrator.ts`: Retrieves grounding passages, builds system prompt from `Prompts.ts`, runs pre/post safety checks, enforces citation on output.

This stack will replace or supplement the active runtime in Phase 2.

---

## Tests

- `src/test/ai-grounding.test.ts`: Citation enforcement, fabricated verse rejection, sensitive counseling redirect, ungrounded answer labeling.
- `src/test/safety.test.ts`: SafetyGate injection blocking, banned phrase detection, em dash cleaning.
- `src/test/runtime.test.ts`: Pipeline injection block, circuit breaker exposure.
- `src/test/guidance-context.test.ts`: Consent gating, null safety, context truncation, season inference.
