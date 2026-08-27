# Correction: ESLint prefer-const in Grounding.ts

## Date: 2026-08-26
## Status: Resolved

## Symptom
CI Lint action failed with exit code 1: `99:7 error 'cleaned' is never reassigned. Use 'const' instead prefer-const`.

## Root Cause
`let cleaned` was declared in `enforceGroundedAnswer` in `src/lib/agent/Grounding.ts` but never modified.

## Fix
Changed `let cleaned = output.replace(/—|–/g, ', ').trim();` to `const cleaned = ...`.

## Regression Shield
`npm run lint` in pre-commit and GitHub Actions CI.
