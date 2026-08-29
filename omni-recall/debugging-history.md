# TheLampStand Root-Cause Debugging & Resolution History

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

## 6. ReferenceError: useNavigate is not Defined on Landing Page (`MarketingPage.tsx`)
- **Symptom**: Visitors landing on `thelampstand.icu/` immediately saw the React ErrorBoundary ("Something went wrong"). Hard resets temporarily disguised the error when service workers or browser cache served older bundles or routed elsewhere.
- **Root Cause**: An icon import update in `src/pages/MarketingPage.tsx` accidentally replaced the line `import { Link, useNavigate } from "react-router-dom";` and `import React from "react";`.
- **Fix**: Restored `import React from "react";` and `import { Link, useNavigate } from "react-router-dom";`.
- **Regression Shield**: Added `src/pages/MarketingPage.test.tsx` which mounts `MarketingPage` within a React Router context and tests all navigation, hooks, and DOM nodes.

## 7. ESLint prefer-const Rule Violation in `Grounding.ts`
- **Symptom**: GitHub Actions CI lint check failed with exit code 1 due to `error 'cleaned' is never reassigned. Use 'const' instead prefer-const`.
- **Root Cause**: `let cleaned` was declared in `enforceGroundedAnswer` but never reassigned.
- **Fix**: Changed `let cleaned` to `const cleaned`.
- **Regression Shield**: `npm run lint` runs in pre-commit and CI verifying 0 warnings and 0 errors.

## 8. Playwright E2E Guidance Safety Strict-Mode Locator Ambiguity
- **Symptom**: Playwright E2E suite failed with strict-mode violation because `getByText('If there is immediate danger, contact emergency services now.')` resolved to two elements in the DOM.
- **Root Cause**: `useAgentController.ts` set `safetyMessage` state (rendered as a banner at the top of the form) while simultaneously populating `pastoralFraming` in the `result` reflection block with identical text.
- **Fix**: Removed redundant top banner message when setting the canonical reflection block result, and restored canonical placeholder `What is weighing on you today?` in `GuidancePage.tsx`.
- **Regression Shield**: `npm run test:e2e` runs in CI across all 6 test specs with 100% pass rate.

## 9. Android PWA Standalone ErrorBoundary Crash and Chunk Mismatch Loop
- **Symptom**: Android mobile users opening the installed PWA in standalone mode saw the ErrorBoundary ("Something went wrong", "An unexpected error occurred. Your data is safe.", [Try Again] [Return Home]), while desktop web worked normally. Pressing "Try Again" or "Return Home" reloaded `/app` and re-triggered the exact same boundary fallback in an unrecoverable loop.
- **Root Cause**: Two contributing factors: (1) When deployments update Vite chunk hashes on the CDN, installed Android PWAs or background service worker shells requesting lazy routes hit 404s for outdated chunk hashes. `isChunkLoadError` only tested 4 narrow string patterns, causing Chromium/Android dynamic import error signatures (such as `Failed to load module script`, `Failed to fetch`, or `ChunkLoadError`) to be treated as unrecoverable runtime crashes instead of triggering a manifest reload. (2) `handleStartGuest` in `MarketingPage.tsx` wrote a non-conformant profile object (`name` instead of `firstName`, `tone: "contemplative"` instead of valid `ToneStyle`, missing `onboardingComplete: true`), causing downstream type divergences.
- **Fix**: Created `lazyWithRetry.ts` to wrap code-split routes with automated single-reload recovery and service worker cache clearing; broadened `isChunkLoadError` to catch all browser module failure signatures; updated `ErrorBoundary.tsx` recovery actions to clear caches via `caches.delete` and reload cleanly; fixed `handleStartGuest` to create a valid, fully typed `UserProfile`; wrapped storage operations in `try/catch` guards; and bumped service worker cache version to `lampstand-shell-v5`.
- **Regression Shield**: Added `src/test/lazyWithRetry.test.ts` and `src/test/errorBoundary.test.tsx` testing module loading error identification, single-reload resilience, and cache clearing. 50 test files and 226 tests pass with 100% success rate.

