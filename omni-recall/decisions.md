# TheLampStand Architectural & Product Decisions

## ADR-001: Zero-Cost and Zero-Telemetry Mission Lock
- **Decision**: TheLampStand remains completely free forever, with 0 ads, 0 paid tiers, 0 monetization features, and 0 PII tracking.
- **Rationale**: Spiritual tools must never exploit user vulnerability, monetize religious reflection, or extract behavioral surveillance data.
- **Status**: Non-negotiable core constraint.

## ADR-002: Local-First Deterministic Fallbacks
- **Decision**: Every feature in TheLampStand (Daily Light, Guidance, Sermon Mode, Examen, Lectio, Journal) must function completely offline with high-quality bundled content.
- **Rationale**: Network unavailability, edge API outages, or remote rate limits must never prevent a user from receiving steady, scripture-grounded pastoral care.
- **Status**: Implemented across `adapters.ts`, `contentLibrary.ts`, `seed.ts`, `sermonLibrary.ts`.

## ADR-003: Single Unified State Machine for Agent Surfaces
- **Decision**: All UI surfaces that interact with the Burning Bush Agent (`FloatingAgent`, `FullscreenAgent`, `GuidancePage`) must consume the canonical `useAgentController()` hook. Independent `useState` state machines are strictly prohibited.
- **Rationale**: Eliminates state desynchronization bugs between mini, fullscreen, and dedicated page views, and guarantees consistent audio, speech, and safety state.
- **Status**: Fully reconciled in Execution Contract v2.

## ADR-004: Standardized Input and Context Bounds
- **Decision**: Define exactly one input cap (`MAX_AI_INPUT_CHARS = 1200`) and one assembled context cap (`MAX_CONTEXT_CHARS = 600`) across the entire repository.
- **Rationale**: Prevents prompt flooding, bounds edge worker compute/token consumption, and eliminates conflicting constant definitions across modules.
- **Status**: Enforced in `Grounding.ts` and `contextAssembler.ts`.

## ADR-005: Targeted Clause-Level AI Filler Sanitization
- **Decision**: Rather than nuking the entire AI response when a single filler phrase ("Let's", "Of course") appears, strip only the sentence containing the filler phrase, preserving the rest of the response and its valid citations unless >50% of the message is gutted.
- **Rationale**: Avoids falsely discarding rich, well-cited responses over trivial provider filler words while maintaining zero-filler standards.
- **Status**: Implemented via `sanitizeAIFiller()` in `agentRuntime.ts`.

## ADR-006: Abbreviation-Tolerant Citation Grounding
- **Decision**: `ensureRuntimeGrounding()` utilizes `hasScriptureCitation()` to recognize standard biblical book abbreviations (e.g. `Jn 3:16`, `Phil 4:6-7`) and verse ranges.
- **Rationale**: Prevents correctly-cited LLM responses from being erroneously tagged with the "TheLampStand cannot verify this" disclaimer due to trivial formatting variations.
- **Status**: Implemented in `agentRuntime.ts`.

## ADR-007: Generative Engine Optimization (GEO) & Authority Schema Architecture
- **Decision**: Provide structured Schema.org JSON-LD `@graph` entities (`WebSite`, `Organization`, `WebApplication`, `FAQPage`, `HowTo`, `BreadcrumbList`), explicit crawler allowlists in `robots.txt` for AI search bots (Google-Extended, GPTBot, PerplexityBot, ClaudeBot, OAI-SearchBot, Applebot-Extended), answer-first semantic content structures on landing pages, and an internal backlink discipline.
- **Rationale**: Ensures top-tier visibility and accurate quotation in Google AI Overviews, Perplexity, ChatGPT Search, and traditional search engines without compromising privacy or adding third-party tracking scripts.
- **Status**: Enforced across `index.html`, `MarketingPage.tsx`, `robots.txt`, and `sitemap.xml`.

## ADR-008: Canonical Crisis Safety Pipeline and Clean Dependency Security
- **Decision**: All crisis, sensitive counseling, and self-harm interventions are handled canonically by `Grounding.ts` (`getRequestGuardrail()`) at the entrance of the agent pipeline, rendering pastoral reflection with emergency contact notices and Scripture comfort. Redundant classification regexes in legacy modules are eliminated.
- **Rationale**: Avoids ambiguous classification conflicts between generic abuse gates and specialized pastoral crisis intervention; verified via Playwright E2E tests against the real UI.
- **Status**: Implemented in `Grounding.ts`, `safety.ts`, and `tests/e2e/guidance-safety.spec.ts`.

## ADR-009: Responsive Desktop Sanctuary, 1-Click Web Guest Experience, and PWA Distribution Hooks
- **Decision**: Elevate `AppShell` with a responsive side-rail navigation and expanded reading surface (`max-w-4xl`) on desktop viewports (≥768px). Provide an instant 1-click web guest mode on `MarketingPage` to eliminate browser onboarding friction. Register PWA quick action shortcuts in `manifest.json` and lock-screen `MediaSession` metadata during audio playback.
- **Rationale**: Closes key market gaps against venture-backed competitors by providing a world-class desktop reading experience, zero-friction web discovery, and native distribution hooks while preserving 100% sovereign privacy.
- **Status**: Implemented in `AppShell.tsx`, `MarketingPage.tsx`, `manifest.json`, and `voice.ts`.

## ADR-010: Brand Unification, Wordmark Asset Standard, and Strict Zero Em-Dash Typography
- **Decision**: Unify brand casing globally to `TheLampStand` and enforce exclusive use of `/images/wordmark-logo.png` in place of composite flame icons. Enforce zero em-dashes (`—`) or en-dashes (`–`) across all user-facing copy, code comments, and documentation.
- **Rationale**: Elevates visual authority, eliminates fragmented logo presentation, and creates clean, humanized typography.
- **Status**: Enforced across `AppShell.tsx`, `HomePage.tsx`, `Grounding.ts`, `README.md`, and `omni-recall/`.

## ADR-011: Expanded Canonical Scripture Catalog & Multi-Theme Grounding
- **Decision**: Expand bundled offline scripture catalog to 100+ canonical passages, 60+ Daily Light reflections, and 35+ homiletic sermons, covering a broader array of pastoral themes (`purpose`, `gratitude`, `burnout`, `betrayal`, `waiting`, `strength`).
- **Rationale**: Dramatically enhances response intelligence, variety, and depth across all app modes while retaining zero-network local offline capability.
- **Status**: Implemented in `contentLibrary.ts`, `sermonLibrary.ts`, and `DailyLightPage.tsx`.
