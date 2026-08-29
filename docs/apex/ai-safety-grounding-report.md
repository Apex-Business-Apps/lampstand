# AI Safety and Grounding Report

## Grounding Behavior
- The live agent runtime (`src/lib/runtime/agentRuntime.ts`) retrieves candidate scripture passages via `RetrievalOrchestrator` and applies Resonance ranking (`src/lib/resonance/ResonanceEngine.ts`) before passing context to the AI provider.
- Scripture-backed answers are verified and forced to include source references in `ensureRuntimeGrounding()` if the provider omits them.
- When no source is retrieved, answers are prefixed with a TheLampStand unverifiable-source statement.

## Guardrails
- Input normalization and character cap (`MAX_AI_INPUT_CHARS = 1200`) is enforced by `src/lib/agent/Grounding.ts`.
- Prompt injection & abuse: `src/lib/safety.ts` (`checkInputSafety`) and `SafetyGate` block override, jailbreak, and system-prompt extraction requests.
- Fabricated Scripture: `src/lib/agent/Grounding.ts` (`getRequestGuardrail`) refuses requests to invent, fake, or create new Bible verses before model execution.
- Sensitive counseling & crisis: `src/lib/agent/Grounding.ts` (`getRequestGuardrail`) redirects emergency, self-harm, abuse, legal, and medical replacement requests to emergency care boundaries.
- Circuit breaker: `src/lib/safety.ts` (`shouldCircuitBreak`) opens after repeated safety events to enforce a gentle resting pause.
- Second-pass filler cleanup: `src/lib/runtime/agentRuntime.ts` (`TurnPipeline`) strips banned conversational filler phrases while preserving scriptural citations.

## Tests
- `src/test/ai-grounding.test.ts`, `src/test/safety.test.ts`, `src/test/circuit.test.ts`, and `src/test/ai-guardrails.test.ts` verify citations, fabricated verse rejection, sensitive counseling redirect, and safety fallback behavior against live modules.
