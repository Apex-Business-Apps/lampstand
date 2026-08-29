# Current Repository Status

*As of: August 29, 2026*
*Active Branch: `apex/lampstand/fix-passage-reference-null-crash`*
*Base: `main` at `4a60566` (PR #120), merged in*

## Operational Truth

- **Brand Standard**: `TheLampStand` unified across code, assets, UI copy, metadata, and `docs/`.
- **Header Branding**: `/images/wordmark-logo.png` (`h-8` desktop, `h-7` mobile) in `AppShell.tsx`.
- **Scripture Content**: 100+ canonical Scripture passages, 60+ Daily Light templates, 35+ homiletic sermons.
- **Typography Rule**: Zero em-dashes and en-dashes. Enforced across `src/`, `public/sw.js`, `docs/`, `MISSION.md`, and `.github/`. Occurrences remaining in `omni-recall/` are citations of the rule itself. `.agents/` and `.jules/` hold third-party agent contracts and are outside this rule.
- **Local Storage**: `src/lib/storage.ts` is the single trusted read and write boundary (ADR-012). A getter never returns a shape it does not declare, and a write never throws through a render. `getPresenceScore()`/`incrementPresenceScore()` additionally guard the `score` field's type, since the boundary's object-level merge does not validate individual field types.
- **Scripture & Resonance Resilience**: Defensive null-guards on `dailyLight`, `ResonanceEngine`, `storage`, and all scripture-rendering pages.
- **Chunk Load Recovery**: `src/lib/lazyWithRetry.ts` (from PR #119) wraps every lazy route with automated single-reload recovery for rotated chunk hashes.
- **Service Worker**: `public/sw.js` v6. Refreshes the cached offline shell on each successful navigation, on top of the v5 cache-name bump that cleared stale chunk-hash entries.
- **Safety Gate**: Canonical crisis, injection, and abuse gates passing in Playwright E2E.
- **SEO & GEO**: Schema.org JSON-LD graph with 6 entity types, 16 sitemap URLs, and AI crawler permissions in `robots.txt`.

## Verification Status

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | exit 0, 0 errors, 0 warnings |
| Types | `npm run typecheck` | exit 0 |
| Unit | `npm test` | 51 files, 259 tests passed |
| Build | `npm run build` | exit 0 |

## Known Gaps (tracked, not silently carried)

- Service worker caches hashed assets only from the second controlled load onward, so a first-ever launch that goes offline immediately renders blank. `wiki/open_loops/service-worker-precache-on-install.md`.
- The ErrorBoundary logs to console only, so a crash reported by screenshot cannot be diagnosed without reproducing it locally (PR #119 improved chunk-error detection breadth but did not add on-device diagnostics). `wiki/open_loops/error-boundary-local-diagnostics.md`.
- `scripts/inject-modulepreload.mjs` looks for `vendor-react` and `vendor-query` chunks. `vite.config.ts` declares no `manualChunks`, so those chunks do not exist and the step logs "No matching chunks found: skipping." on every build. Harmless today, but the script does nothing.

## Checkpoint Rule

This file states what was verified on the branch it names, with the commands and counts that produced the numbers. Do not carry figures forward from an earlier checkpoint without re-running the gates.
