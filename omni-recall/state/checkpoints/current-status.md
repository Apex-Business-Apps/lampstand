# Current Repository Status

*As of: August 28, 2026*
*Active Branch: `apex/lampstand/fix-pwa-error-boundary-and-chunk-retry`*
*Active PR: [PR #119](https://github.com/Apex-Business-Apps/lampstand/pull/119)*

## Operational Truth

- **Brand Standard**: `TheLampStand` unified across code, assets, UI copies, and metadata.
- **Header Branding**: Uses `/images/wordmark-logo.png` (`h-8` on desktop, `h-7` on mobile) in `AppShell.tsx`.
- **Scripture Content**: 100+ canonical Scripture passages, 60+ Daily Light templates, 35+ homiletic sermons.
- **Typography Rule**: Strict zero-em-dash rule enforced globally.
- **Safety Gate**: Canonical crisis, injection, and abuse gates passing 100% in Playwright E2E.
- **PWA Resilience**: `lazyWithRetry` wrapper, broadened chunk error detection in `ErrorBoundary.tsx`, and service worker v5 cache busting.
- **SEO & GEO**: Schema.org JSON-LD graph with 6 entity types, 16 sitemap URLs, and AI crawler permissions in `robots.txt`.
- **Verification Status**:
  - `npm run lint`: 0 errors, 0 warnings (exit 0).
  - `npm test`: 50 test files, 226 tests passing (exit 0).
  - `npm run test:e2e`: 6 Playwright specs passing (exit 0).
  - `npm run build`: Production bundle builds cleanly in ~42s (exit 0).
