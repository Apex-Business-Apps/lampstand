# Correction: Persisted null crashed the installed PWA into the ErrorBoundary

## Date: 2026-08-29
## Status: Resolved

## Symptom
The installed Android PWA opened to the ErrorBoundary fallback ("Something went wrong. An unexpected error occurred. Your data is safe.") on launch. The same deployed bundle ran correctly in the desktop browser, which made the failure look platform specific.

## Root Cause
`get<T>(key, fallback)` in `src/lib/storage.ts` returned `raw ? JSON.parse(raw) : fallback`. A persisted literal `"null"` is a truthy string, so it parsed to `null` and the declared default was skipped. Every consumer of these getters dereferences the result immediately:

- `getPresenceScore().lastActivityAt`, read at the top of `HomePage`
- `getKnowledge().lastStreakDate`, read by `updateStreak()`
- `getConsentState().localAdaptiveMemory`, read by `updateKnowledge()`
- `getVoicePreferences()`, read by `SettingsPage`

One corrupt key therefore threw a `TypeError` during render and React unmounted the whole tree into the ErrorBoundary.

The defect is data shaped, not platform shaped. The desktop profile happened to hold clean records. The installed PWA is simply the surface that reads every persisted record on first paint, because `ProfileGuard` sends standalone traffic straight into `/app`.

Two earlier passes (PR #117, PR #118) hardened individual call sites (`getSavedPassages`, `getCachedDaily`) and bumped the service worker cache, but left the boundary itself trusting `localStorage`, so the class of bug survived.

Secondary defects found and closed in the same pass:
- `set()` let a `QuotaExceededError` propagate. `getPresenceScore()` writes during render, so a device at its origin quota crashed the app the same way.
- `getProfile()` returned a truthy non-record unchanged, which would pass `ProfileGuard` and reach pages that read fields off it.
- `getPresenceScore()` computed `NaN` from an unparseable timestamp and persisted it.

## Fix
`src/lib/storage.ts` now owns a single trusted read and write boundary:
- `get()` rejects a persisted `null` or `undefined`, falls back wholesale on shape drift (an array, string, number, or boolean where a record belongs), and completes a partial legacy record from the current defaults so newly added fields are never `undefined`.
- `set()` never throws through a React render.
- `getProfile()` returns `null` unless the stored value is a record.
- `getPresenceScore()` repairs an unparseable timestamp instead of persisting `NaN`.

`public/sw.js` v5 additionally refreshes the cached offline shell on each successful navigation. `install` only re-runs when that file's bytes change, so the shell an offline launch fell back to was frozen at install time and could be many deploys old.

## Regression Shield
- `src/test/storage-corruption-boundary.test.ts`: every record getter and list getter is asserted against nine corruption shapes. Fails 16 tests against the previous implementation.
- `tests/e2e/pwa-corrupt-storage.spec.ts`: drives the real UI across five routes with each record key corrupted. Fails 4 specs against the previous implementation. It waits on the app shell before asserting the crash text is absent, so the assertion cannot pass before React mounts.
- `src/test/pwa-service-worker.test.ts`: asserts the navigation handler refreshes the cached shell.

## Standing Rule
`localStorage` is untrusted input. It survives app versions, schema changes, interrupted writes, and anything else sharing the origin. No getter in `src/lib/storage.ts` may return a value that is not the shape it declares, and no writer may throw into a render.
