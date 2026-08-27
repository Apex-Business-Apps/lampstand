# Architecture Node: Agent Runtime Pipeline

## File Locations
- Canonical Controller: `src/hooks/useAgentController.ts`
- Runtime Execution: `src/lib/runtime/agentRuntime.ts`
- Grounding & Guardrails: `src/lib/agent/Grounding.ts`
- Safety & Crisis Gates: `src/lib/safety.ts`
- Adapters: `src/lib/adapters.ts`, `src/lib/groq.ts`

## Pipeline Flow

1. **Input Normalization**:
   - `normalizeUserInput(rawInput)`: Strips extraneous whitespace and enforces `MAX_AI_INPUT_CHARS = 1200`.
2. **Circuit Breaker**:
   - `shouldCircuitBreak()`: If ≥5 safety events occurred in the past 5 minutes, fails closed to `SAFE_FALLBACK_RESPONSE`.
3. **Safety & Crisis Gate**:
   - `checkInputSafety(input)`: Evaluates for crisis, prompt injection, abuse, and out-of-scope topics.
   - For crisis topics (self-harm, suicide), returns empathetic pastoral emergency response with 988 lifeline notice and safe comforting Scripture (Psalm 46:10).
4. **Grounding Interceptor**:
   - `getRequestGuardrail(input)`: Intercepts fabricated Scripture requests ("invent a Bible verse") and redirects medical/legal questions.
5. **Retrieval & Resonance Scoring**:
   - `RetrievalOrchestrator.retrieve(input)`: Fetches candidate passages (`topK = 5`).
   - `ResonanceEngine.rankCandidates()`: Ranks passages by 5-axis personalized weights (affinity, season, novelty, pastoral care, topic continuity).
6. **Local Context Assembly**:
   - `assembleGuidanceContext()`: Injects daily light theme, recent journal excerpts, and saved passages (capped at `MAX_CONTEXT_CHARS = 600`, requiring user privacy consent).
7. **Synthesis & Sanitization**:
   - `GroqAIAdapter` / `LocalAIAdapter`: Generates grounded response.
   - `sanitizeAIFiller()`: Strips generic AI conversational filler sentences.
   - `ensureRuntimeGrounding()`: Verifies explicit Scripture citation with abbreviation and verse range tolerance (`hasScriptureCitation`).
