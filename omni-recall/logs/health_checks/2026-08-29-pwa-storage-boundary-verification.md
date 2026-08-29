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

## Update: Reconciled with PR #119 (merged to main during this work)

While this fix was in flight, PR #119 merged to `main` addressing a different root cause for the identical ErrorBoundary text (stale chunk hashes; per-field guards inside `getPresenceScore`/`incrementPresenceScore` only). Merged `origin/main` into this branch and resolved conflicts in `src/lib/storage.ts` (combined both fixes' guards rather than picking one), `public/sw.js` (renumbered to v6 since both branches had independently claimed v5 with different bytes), and two `omni-recall/` docs.

**Negative control, run against PR #119's `storage.ts` in isolation** (this branch's changes to that file reverted, everything else kept):

| Check | Result |
|---|---|
| `storage-corruption-boundary.test.ts` | 17 of 30 tests fail |
| `pwa-corrupt-storage.spec.ts` | 3 of 7 specs fail: `lampstand_knowledge`, `lampstand_consent`, `lampstand_voice_preferences` |

`lampstand_presence_score` passes under #119 alone (its added guard covers exactly that key). The other three still crash the installed PWA on `main` as of this writing. This is the direct evidence that the two fixes are complementary, not redundant.

**Full gate, re-run after the merge and restoring this branch's `storage.ts`:**

| Gate | Result |
|---|---|
| `npm run lint` | exit 0 |
| `npm run typecheck` | exit 0 |
| `npm test` | 51 files, 257 tests passed |
| `npx playwright test` | 13 specs passed (includes PR #119's `lazyWithRetry.test.ts` and `errorBoundary.test.tsx`) |
| `npm run build` | exit 0 |
| `npm audit --omit=dev --audit-level=high` | 0 vulnerabilities |
| `npx wrangler deploy --dry-run --config wrangler.json` | succeeds |
| `ci.yml`'s PWA artifact and bundle key-leak checks, run manually | all pass |
