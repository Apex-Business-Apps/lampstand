# Current Repository Status

*As of: August 29, 2026*
*Active Branch: `claude/lampstand-pwa-android-fix-8iameg`*
*Base: `main` at `0522fe7` (PR #119), merged in*
*Head: this branch's merge commit reconciling PR #119 with the storage boundary fix below*

## Operational Truth

- **Brand Standard**: `TheLampStand` unified across code, assets, UI copy, metadata, and `docs/`.
- **Header Branding**: `/images/wordmark-logo.png` (`h-8` desktop, `h-7` mobile) in `AppShell.tsx`.
- **Scripture Content**: 100+ canonical Scripture passages, 60+ Daily Light templates, 35+ homiletic sermons.
- **Typography Rule**: Zero em-dashes and en-dashes. Enforced across `src/`, `public/sw.js`, `docs/`, `MISSION.md`, and `.github/`. Occurrences remaining in `omni-recall/` are citations of the rule itself. `.agents/` and `.jules/` hold third-party agent contracts and are outside this rule.
- **Local Storage**: `src/lib/storage.ts` is the single trusted read and write boundary (ADR-012). A getter never returns a shape it does not declare, and a write never throws through a render. `getPresenceScore()`/`incrementPresenceScore()` additionally guard the `score` field's type, since the boundary's object-level merge does not validate individual field types.
- **Chunk Load Recovery**: `src/lib/lazyWithRetry.ts` (from PR #119) wraps every lazy route with automated single-reload recovery for rotated chunk hashes.
- **Service Worker**: `public/sw.js` v6. Refreshes the cached offline shell on each successful navigation (this branch), on top of the v5 cache-name bump that cleared stale chunk-hash entries (PR #119).
- **Safety Gate**: Canonical crisis, injection, and abuse gates passing in Playwright E2E.
- **SEO & GEO**: Schema.org JSON-LD graph with 6 entity types, 16 sitemap URLs, and AI crawler permissions in `robots.txt`.

## Two Root Causes, One Symptom

PR #119 and this branch each closed a distinct root cause behind the identical ErrorBoundary text ("Something went wrong. An unexpected error occurred. Your data is safe."):

- **PR #119** (merged to `main` before this branch merged it back in): stale chunk hashes after a deploy, and per-field guards added directly inside `getPresenceScore`/`incrementPresenceScore` for the `score` field.
- **This branch**: `get()`/`set()` in `storage.ts` trusted `localStorage` unconditionally. A persisted `null` in *any* other record key (`lampstand_knowledge`, `lampstand_consent`, `lampstand_voice_preferences`, and others) still crashed the app after PR #119 landed. Verified directly: checking out PR #119's `storage.ts` in isolation and running `storage-corruption-boundary.test.ts` against it still fails 17 of 30 tests, and `pwa-corrupt-storage.spec.ts` still fails on `lampstand_knowledge`, `lampstand_consent`, and `lampstand_voice_preferences` (only `lampstand_presence_score` was fixed by #119).

See `wiki/corrections/persisted-null-crashes-installed-pwa.md` and `debugging-history.md` entries 9 and 10.

## Verification Status

Run on this branch after merging `origin/main` (PR #119) and resolving the resulting conflicts in `src/lib/storage.ts`, `public/sw.js`, and two `omni-recall/` docs. Full log: `omni-recall/logs/health_checks/2026-08-29-pwa-storage-boundary-verification.md`.

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | exit 0, 0 errors, 0 warnings |
| Types | `npm run typecheck` | exit 0 |
| Unit | `npm test` | 51 files, 257 tests passed |
| E2E | `npx playwright test` | 13 specs passed |
| Build | `npm run build` | exit 0, ~9s |
| Security audit | `npm audit --omit=dev --audit-level=high` | 0 vulnerabilities |
| Worker dry-run | `npx wrangler deploy --dry-run --config wrangler.json` | succeeds |
| PWA artifact + key-leak checks (`ci.yml` gate steps) | manual re-run of each `ci.yml` step | all pass |

## Known Gaps (tracked, not silently carried)

- Service worker caches hashed assets only from the second controlled load onward, so a first-ever launch that goes offline immediately renders blank. `wiki/open_loops/service-worker-precache-on-install.md`.
- The ErrorBoundary logs to console only, so a crash reported by screenshot cannot be diagnosed without reproducing it locally (PR #119 improved chunk-error detection breadth but did not add on-device diagnostics). `wiki/open_loops/error-boundary-local-diagnostics.md`.
- `scripts/inject-modulepreload.mjs` looks for `vendor-react` and `vendor-query` chunks. `vite.config.ts` declares no `manualChunks`, so those chunks do not exist and the step logs "No matching chunks found: skipping." on every build. Harmless today, but the script does nothing.

## Checkpoint Rule

This file states what was verified on the branch it names, with the commands and counts that produced the numbers. Do not carry figures forward from an earlier checkpoint without re-running the gates.
