# Correction: Persisted null crashed the installed PWA into the ErrorBoundary

## Date: 2026-08-29
## Status: Resolved

## Symptom
Founder screenshot of the installed Android PWA showing the ErrorBoundary fallback on launch: "Something went wrong. An unexpected error occurred. Your data is safe." with Try Again and Return Home. The desktop browser ran the same deployed bundle correctly.

## Root Cause
`get<T>(key, fallback)` in `src/lib/storage.ts` returned `raw ? JSON.parse(raw) : fallback`. A persisted literal `"null"` is truthy, parses to `null`, and skipped the declared default. `getPresenceScore()` is called at the top of `HomePage`, so `value.lastActivityAt` threw a `TypeError` during render.

Verified against the deployed bundle: the local production build reproduced the hash served at `thelampstand.icu` (`assets/index-BZ5VSE0t.js`), and the crash reproduced under Chromium in `display-mode: standalone` with `lampstand_presence_score` set to `"null"`.

## Fix
- `src/lib/storage.ts`: single trusted read and write boundary (see ADR-012).
- `public/sw.js` v5: refresh the cached offline shell on each successful navigation.

## Regression Shield
- `src/test/storage-corruption-boundary.test.ts`: 30 tests. 16 fail against the previous implementation.
- `tests/e2e/pwa-corrupt-storage.spec.ts`: 7 specs. 4 fail against the previous implementation.
- `src/test/pwa-service-worker.test.ts`: 8 tests, one new invariant for the shell refresh.

## Standing Rule
`localStorage` is untrusted input. Promoted to `constraints.md` section 3 and ADR-012.
