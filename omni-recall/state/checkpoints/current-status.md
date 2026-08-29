# Current Repository Status

*As of: August 29, 2026*
*Active Branch: `claude/lampstand-pwa-android-fix-8iameg`*
*Head Commit: `092ea23` fix(pwa): stop a corrupt local record crashing the installed app into the ErrorBoundary*
*Base: `main` at `3816183` (PR #118)*

## Operational Truth

- **Brand Standard**: `TheLampStand` unified across code, assets, UI copy, metadata, and `docs/`.
- **Header Branding**: `/images/wordmark-logo.png` (`h-8` desktop, `h-7` mobile) in `AppShell.tsx`.
- **Scripture Content**: 100+ canonical Scripture passages, 60+ Daily Light templates, 35+ homiletic sermons.
- **Typography Rule**: Zero em-dashes and en-dashes. Enforced across `src/`, `public/sw.js`, `docs/`, `MISSION.md`, and `.github/`. Occurrences remaining in `omni-recall/` are citations of the rule itself. `.agents/` and `.jules/` hold third-party agent contracts and are outside this rule.
- **Local Storage**: `src/lib/storage.ts` is the single trusted read and write boundary (ADR-012). A getter never returns a shape it does not declare, and a write never throws through a render.
- **Service Worker**: `public/sw.js` v5. Refreshes the cached offline shell on each successful navigation.
- **Safety Gate**: Canonical crisis, injection, and abuse gates passing in Playwright E2E.
- **SEO & GEO**: Schema.org JSON-LD graph with 6 entity types, 16 sitemap URLs, and AI crawler permissions in `robots.txt`.

## Verification Status

Run on this branch at commit `092ea23`. Full log: `omni-recall/logs/health_checks/2026-08-29-pwa-storage-boundary-verification.md`.

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | exit 0, 0 errors, 0 warnings |
| Types | `npm run typecheck` | exit 0 |
| Unit | `npm test` | 49 files, 252 tests passed |
| E2E | `npx playwright test` | 13 specs passed |
| Build | `npm run build` | exit 0, 11.9s |

## Known Gaps (tracked, not silently carried)

- Service worker caches hashed assets only from the second controlled load onward, so a first-ever launch that goes offline immediately renders blank. `wiki/open_loops/service-worker-precache-on-install.md`.
- The ErrorBoundary logs to console only, so a crash reported by screenshot cannot be diagnosed without reproducing it locally. `wiki/open_loops/error-boundary-local-diagnostics.md`.
- `scripts/inject-modulepreload.mjs` looks for `vendor-react` and `vendor-query` chunks. `vite.config.ts` declares no `manualChunks`, so those chunks do not exist and the step logs "No matching chunks found: skipping." on every build. Harmless today, but the script does nothing.

## Checkpoint Rule

This file states what was verified on the branch it names, with the commands and counts that produced the numbers. Do not carry figures forward from an earlier checkpoint without re-running the gates.
