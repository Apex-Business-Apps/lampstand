# LampStand Root-Cause Debugging & Resolution History

## 1. Dead File References and Ghost Orchestrators
- **Symptom**: `docs/apex/` referenced 7 deleted orchestration files (`ConversationOrchestrator.ts`, `RetrievalOrchestrator.ts`, `CircuitBreaker.ts`, `SafetyGate.ts`, `AgentInterfaces.ts`, `GroqAdapter.ts`, `NullAdapter.ts`).
- **Root Cause**: Earlier refactoring consolidated modular classes into unified singletons in `src/lib/runtime/agentRuntime.ts` and `src/lib/adapters.ts`, leaving dead files and stale documentation.
- **Fix**: Deleted dead files, cleaned up unused imports, and aligned documentation with the single runtime architecture.
- **Regression Shield**: Typecheck and build pipelines verify 0 unresolved module imports across `src/`.

## 2. Duplicate State Machine in `GuidancePage.tsx`
- **Symptom**: `GuidancePage.tsx` maintained its own local `useState` agent variables (`isListening`, `isSpeaking`, `voiceGender`, `replay`), duplicating the global agent state machine.
- **Root Cause**: Guidance page was originally developed before `useAgentController()` was unified as the single source of truth.
- **Fix**: Refactored `GuidancePage.tsx` to consume `useAgentController()`, eliminating duplicate state machines and syncing audio controls.
- **Regression Shield**: `GuidancePage.test.tsx` validates agent interaction and audio toggle parity.

## 3. Disparate Context and Input Bounds
- **Symptom**: `MAX_CONTEXT_CHARS` was defined in multiple places with conflicting values (1800 chars vs 600 chars).
- **Root Cause**: `src/lib/agent/Grounding.ts` defined a local 1800-char cap while `src/lib/guidance/contextAssembler.ts` used 600 chars.
- **Fix**: Standardized `MAX_CONTEXT_CHARS = 600` exported from `contextAssembler.ts` and `MAX_AI_INPUT_CHARS = 1200` in `Grounding.ts`.
- **Regression Shield**: Unit tests in `src/test/` assert truncation bounds.

## 4. Aggressive AI-Filler Rejection Discarding Valid Grounded Responses
- **Symptom**: Minor filler phrases like "Let's reflect on this" caused `agentRuntime.ts` to discard entire valid AI responses and fallback to generic seed scripture.
- **Root Cause**: Whole-response rejection regex triggered on any single filler occurrence.
- **Fix**: Implemented `sanitizeAIFiller()` which strips only the offending sentence, falling back only if >50% of the message is gutted.
- **Regression Shield**: `src/test/runtime.test.ts` tests multi-sentence responses with and without filler words.

## 5. False Grounding Disclaimers on Canonical Abbreviated Citations
- **Symptom**: Citations like "Jn 3:16" or "Phil 4:6-7" were flagged as ungrounded because the citation regex only matched full book names.
- **Root Cause**: `HAS_SCRIPTURE_CITATION_RE` lacked common biblical book abbreviations and verse ranges.
- **Fix**: Added `hasScriptureCitation()` supporting 30+ canonical book abbreviations and dashed verse ranges.
- **Regression Shield**: `src/test/runtime.test.ts` validates abbreviations across OT and NT.
