# Health Check: PWA storage boundary remediation

## Date: 2026-08-29
## Branch: `claude/lampstand-pwa-android-fix-8iameg`
## Commit: `092ea23`

## Machine Verification

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | exit 0, 0 errors, 0 warnings |
| Types | `npm run typecheck` | exit 0 |
| Unit | `npm test` | 49 files, 252 tests passed |
| E2E | `npx playwright test` | 13 specs passed |
| Build | `npm run build` | exit 0, built in 11.9s |

## Reproduction Evidence

The local production build reproduced the asset hash served at `thelampstand.icu` (`assets/index-BZ5VSE0t.js`), confirming the tested bundle matched the deployed one.

Under Chromium launched with `--app=` (which reports `display-mode: standalone`, matching an installed PWA) and an Android user agent:

| Corrupted key | Before | After |
|---|---|---|
| `lampstand_presence_score` | `TypeError: Cannot read properties of null (reading 'lastActivityAt')`, ErrorBoundary on `/app` | renders |
| `lampstand_knowledge` | `TypeError: ... (reading 'lastStreakDate')`, ErrorBoundary on `/app` | renders |
| `lampstand_consent` | `TypeError: ... (reading 'localAdaptiveMemory')`, ErrorBoundary on `/app` and `/settings` | renders |
| `lampstand_voice_preferences` | ErrorBoundary on `/settings` | renders |

With all seven record keys corrupted at once, the standalone app renders the home surface both online and offline.

## Negative Control

Both shields were run against the previous `get()` implementation to confirm they fail without the fix: 16 unit tests failed and 4 E2E specs failed. An earlier draft of the E2E spec passed in both directions because it asserted the absence of the crash text before React mounted; it now waits on the app shell first.

## Known Gaps

- The service worker caches hashed assets only from the second controlled load onward, because the first document load completes before the worker claims the client. A first-ever launch that goes offline immediately still renders blank. Tracked in `wiki/open_loops/service-worker-precache-on-install.md`.
- The ErrorBoundary logs the failing error to the console only, so a founder-reported crash cannot be diagnosed from a screenshot alone. Tracked in `wiki/open_loops/error-boundary-local-diagnostics.md`.
