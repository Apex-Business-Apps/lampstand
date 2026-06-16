# LampStand — Critical Routing Architecture

**Version:** 2.0.1  
**Last updated:** 2026-06-16  
**Status:** Locked — DO NOT modify without explicit founder authorization.

---

## The Core Rule

Routing is strictly bifurcated based on the user's platform context (Browser vs. PWA).

### 1. Browser Users (Standard Web Visit)

**Rule:** When a user visits `thelampstand.icu` in a browser, or attempts to
directly access `/app` without being logged in, they **MUST** land on the
Marketing Page (`/` or `/welcome`).

**Why:** To introduce the product, convert traffic, and present the value
proposition before login/signup.

### 2. PWA / Installed App Users

**Rule:** When a user opens the installed PWA (standalone display mode) while
not logged in, they **MUST** bypass the Marketing Page and go directly to
`/auth`.

**Why:** Installed-app users are already converted. Marketing is unnecessary —
they just need to log back in.

---

## Route Aliases

| Path | Target | Notes |
|------|--------|-------|
| `/` | `MarketingPage` | Primary marketing entry |
| `/welcome` | `MarketingPage` | Legacy alias — preserved for old links/bookmarks |
| `/lite` | `LiteLandingPage` | Unauthenticated burning-bush preview (no FloatingAgent). Internal state: `landing` → `agent`. Authenticated users are redirected to `/app`. |
| `/entry` | `EntryPage` | PWA entry point — evaluates standalone mode |
| `/auth` | Auth flow | Login / magic-link |
| `/app` | Main app (guarded) | Requires auth — redirects via `ProfileGuard` |

---

## Implementation Details

### `EntryPage.tsx`

Handles the `/entry` route. Evaluates `isStandaloneDisplayMode()`.
- If `true` → redirect unauthenticated users to `/auth`
- If `false` → redirect to `/` (MarketingPage)

### `ProfileGuard.tsx`

Wraps all internal app routes (`/app`, `/daily`, etc.) in `App.tsx`.
If an unauthenticated user hits a guarded route directly:
- Standalone/PWA → redirect to `/auth`
- Standard browser → redirect to `/`

### `FloatingAgent.tsx` — HIDDEN_PATHS

The FloatingAgent is hidden on the following paths to prevent UI overlap:

```typescript
const HIDDEN_PATHS = [
  '/', '/welcome', '/lite',
  '/onboarding', '/auth', '/reset-password',
  '/legal', '/legal/privacy', '/legal/terms',
  '/legal/acceptable-use', '/legal/disclaimer', '/legal/company',
];
```

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 2.0.2 | 2026-06-16 | `/lite` now uses internal state machine (`landing`→`agent`); minimize returns to landing view, not `/`. Authenticated users on `/lite` redirect to `/app`. `FullscreenAgent` visually unified with MarketingPage. |
| 2.0.1 | 2026-06-16 | Added `/welcome` alias, `/lite` burning-bush preview route, HIDDEN_PATHS table, and versioning header. |
| 2.0.0 | 2026-06-10 | Initial routing rules document. |
