# Security Hardening Report

## Controls Implemented
- Prompt-injection resistance remains enforced by `src/lib/agent/SafetyGate.ts` and is reinforced by grounded system-prompt instructions in `src/lib/agent/Grounding.ts`.
- Fabricated scripture requests are blocked before provider execution in `src/lib/agent/Grounding.ts`.
- Sensitive counseling, emergency, medical, and legal replacement risks are redirected before provider execution in `src/lib/agent/Grounding.ts`.
- Ungrounded AI answers are explicitly labeled as not verified from LampStand source passages in `src/lib/agent/Grounding.ts`.
- Cloudflare worker health responses receive the same security headers as assets in `src/workers/static-spa.ts`.
- Local write paths deduplicate retry submissions in `src/lib/storage.ts`.

## Controls Fixed (Production Gate Audit — 2026-06-11)
- **CSP `font-src` and `style-src`**: the prior CSP blocked Google Fonts at runtime, breaking the Inter typeface across all pages. Both `fonts.googleapis.com` and `fonts.gstatic.com` are now explicitly allowlisted in `src/workers/static-spa.ts`.
- **SPA deep-link fallback**: the prior worker returned a `404 Not Found` status for all non-asset routes (e.g., `/journal`, `/settings`), breaking hard navigation and fresh-tab deep links. The catch-all now returns `200 OK` with the `index.html` SPA shell so client-side routing takes over.
- **Dead font preload removed**: `index.html` contained a `<link rel="preload">` for `/fonts/Inter-Variable.woff2` which was never present in the asset bundle, producing a console warning on every page load. The tag was removed.
- **Supabase preconnect derived from env**: `index.html` now uses `%VITE_SUPABASE_URL%` for the `<link rel="preconnect">` hint instead of a hardcoded stale project URL, so the hint always matches whichever project is active.

## Existing Controls Verified
- Supabase RLS policies for user-owned profiles, saved passages, journal entries, daily light history, and roles are present under `supabase/migrations/`.
- Admin route is guarded by `src/components/AuthGuard.tsx` in `src/App.tsx`.
- CSP, HSTS, frame, content-type, referrer, and permissions headers are configured in `src/workers/static-spa.ts` (CSP font allowlist corrected as noted above).

## Tests Added
- `src/test/ai-grounding.test.ts` covers citations, fabricated scripture refusal, sensitive counseling redirect, and ungrounded labeling.
- `src/test/storage-idempotency.test.ts` covers duplicate-safe local writes.
- `src/test/worker-health.test.ts` covers health response security headers.
