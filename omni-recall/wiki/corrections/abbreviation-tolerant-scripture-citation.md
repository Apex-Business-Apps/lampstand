# Correction: Abbreviation-Tolerant Scripture Citation Grounding

## Date: 2026-06-18
## Status: Resolved

## Symptom
Properly cited responses citing "Jn 3:16" or "Phil 4:6-7" received an ungrounded disclaimer banner.

## Root Cause
Grounding regex only matched full book names.

## Fix
Added `hasScriptureCitation()` in `agentRuntime.ts` with support for 30+ Old and New Testament book abbreviations and dashed verse ranges.

## Regression Shield
`src/test/runtime.test.ts` validates abbreviation grounding.
