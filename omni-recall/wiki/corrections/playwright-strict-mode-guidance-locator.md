# Correction: Playwright Strict-Mode Guidance Locator Ambiguity

## Date: 2026-08-27
## Status: Resolved

## Symptom
Playwright E2E test `guidance-safety.spec.ts` failed with:
`Error: strict mode violation: getByText('If there is immediate danger, contact emergency services now.') resolved to 2 elements: 1) banner, 2) reflection block`.

## Root Cause
`useAgentController.ts` called `setSafetyMessage(msg)` (rendering a top alert banner) while simultaneously setting `pastoralFraming: msg` in the `result` state (rendering in the ReflectionBlock). Additionally, the textarea placeholder was slightly out of sync.

## Fix
1. Restored canonical placeholder `What is weighing on you today?` in `GuidancePage.tsx`.
2. Removed redundant top banner state in `useAgentController.ts` when returning the canonical reflection block result.
3. Updated emergency crisis text in `safety.ts` and `Grounding.ts` to include the exact period-terminated sentence: `If there is immediate danger, contact emergency services now.`

## Regression Shield
`npm run test:e2e` executes in CI across all 6 test specs with 100% pass rate.
