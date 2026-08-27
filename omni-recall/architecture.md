# TheLampStand Architecture Map

## Overview
TheLampStand is an offline-first, private Bible companion and pastoral AI web application developed by APEX Business Systems Ltd. It provides daily scripture reflections, contemplative lectio divina, daily examen, homiletically structured sermon reflections, and a warm, voice-capable conversational agent (the Burning Bush Agent).

## Core Principles
1. **Mission Lock**: 100% free forever, no advertisements, no paywalls, zero PII telemetry, zero monetization.
2. **Local-First & Offline Capable**: All scripture content, sermon drafts, daily light templates, and personalization fingerprints run completely on-device without requiring remote databases or network connectivity.
3. **Fail-Closed Safety**: Multi-stage safety gates block prompt injection, fabricated scripture requests, and crisis queries before provider execution.
4. **Zero AI Filler**: Pastoral tone is grounded, still, and authoritative, strictly avoiding superficial AI platitudes.
5. **Generative Engine Optimization (GEO) & Authority**: First-class Schema.org graph and robots.txt crawler permissions ensure accurate indexing and citation across Google AI Overviews, Perplexity, and ChatGPT Search.

---

## System Architecture

```
+-------------------------------------------------------------------------------+
|                               Browser Client (SPA)                            |
|                                                                               |
|  +-------------------+   +--------------------+   +------------------------+  |
|  |  UI Surfaces      |   |  State & Context   |   |  Agent System          |  |
|  |  - /app (Home)    |   |  - useAuth         |   |  - useAgentController  |  |
|  |  - /daily         |   |  - useProfile      |   |  - AgentPresence       |  |
|  |  - /guidance      |   |  - useJournal      |   |  - FullscreenAgent     |  |
|  |  - /sermon        |   |  - useTheme        |   |  - BurningBushCanvas   |  |
|  |  - /lectio        |   +--------------------+   +-----------+------------+  |
|  |  - /examen        |                                        |               |
|  |  - /saved         |                                        v               |
|  |  - /journal       |                             +--------------------+     |
|  +-------------------+                             | TurnPipeline       |     |
|                                                    | - CircuitBreaker   |     |
|                                                    | - SafetyGate       |     |
|                                                    | - Grounding Check  |     |
|                                                    | - Retrieval (topK) |     |
|                                                    | - Resonance Engine |     |
|                                                    | - Sanitizer        |     |
|                                                    +---------+----------+     |
|                                                              |                |
|  +-----------------------------------------------------------+-------------+  |
|  | Storage & Resonance Subsystem (Local-First)                             |  |
|  | - localStorage (capped profiles, saved passages, journals, safety logs) |  |
|  | - ResonanceEngine (theme affinity, season, novelty, pastoral care)      |  |
|  +-------------------------------------------------------------------------+  |
+---------------------------------------+---------------------------------------+
                                        | (Optional Auth Sync / Groq Proxy)
                                        v
+-------------------------------------------------------------------------------+
|                       Edge & Cloud Services (Cloudflare + Supabase)           |
|  - Cloudflare Worker (src/workers/static-spa.ts): Static Asset & SPA Router   |
|  - Supabase Edge Function (/functions/v1/groq-guidance): Groq LLM Proxy       |
|  - Supabase Database (PostgreSQL with RLS): User-consented cloud sync         |
+-------------------------------------------------------------------------------+
```

---

## Subsystem Details

### 1. Agent Runtime Pipeline (`src/lib/runtime/agentRuntime.ts`)
- **Canonical Controller**: All agent surfaces (FloatingAgent, FullscreenAgent, GuidancePage) route through `useAgentController()`.
- **Pipeline Execution**:
  1. `CircuitBreaker.isOpen()`: Fails closed to safe fallback if repeated safety triggers occur.
  2. `normalizeUserInput(input)`: Hard-capped to `MAX_AI_INPUT_CHARS = 1200`.
  3. `getRequestGuardrail(input)`: Blocks fabricated verse generation and redirects crisis/medical/legal topics.
  4. `SafetyGate.evaluate(input)`: Inspects for prompt injection and toxic phrases.
  5. `RetrievalOrchestrator.retrieve(input)`: Searches local and indexed scriptures (`topK: 5`).
  6. `ResonanceEngine.rankCandidates()`: Personalizes passage selection via multi-axis on-device scoring.
  7. `contextAssembler.assembleGuidanceContext()`: Assembles local signals capped at `MAX_CONTEXT_CHARS = 600`.
  8. `ConversationOrchestrator.synthesizeGuidance()`: Generates response via GroqAIAdapter or LocalAIAdapter.
  9. `sanitizeAIFiller()`: Strips clauses matching banned AI filler phrases.
  10. `ensureRuntimeGrounding()`: Validates scripture citation with abbreviation and verse range tolerance (`hasScriptureCitation`).

### 2. Resonance Personalization Engine (`src/lib/resonance/ResonanceEngine.ts`)
- 100% on-device, mathematical personalization tracking 5 continuous axes:
  - **Theme Affinity**: Exponentially decaying frequency of engaged themes.
  - **Spiritual Season**: Adaptive classification (`seeking`, `wrestling`, `consolation`, `desert`, `celebration`, `steady`).
  - **Novelty Bonus**: Prevents repetitive recommendations.
  - **Pastoral Care**: Weighting consolation over correction during distressed sentiment.
  - **Topic Continuity**: `calculateTopicContinuity()` provides subtle reinforcement for recently explored topics.

### 3. Edge Worker & Security (`src/workers/static-spa.ts`)
- Cloudflare Workers static asset serving with security headers:
  - `Content-Security-Policy`: Strictly allowlists Google Fonts, Supabase, Groq, and Cloudflare workers.
  - SPA Fallback: Deep routes (`/guidance`, `/daily`, `/sermon`, `/journal`) return `200 OK` with `index.html` shell.
  - Dedicated `/health` endpoint for uptime probes.
