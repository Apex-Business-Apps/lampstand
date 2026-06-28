# LampStand — Critical Routing Architecture

**Version:** 2.1.1
**Last updated:** 2026-06-28
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
not logged in and has no local profile, they **MUST** enter guest mode directly
at `/app`. They are NOT forced to `/auth`.

**Why:** Guest mode is core to LampStand's mission (privacy-first, no login required).
Installed-app users should be able to use the full app locally without creating an account.
The auth flow remains accessible at `/auth` for users who want cloud sync.

> **Note:** Auth is always reachable at `/auth` but is never forced on PWA users
> who have no profile. Guest mode is the default for new standalone installs.

---

## Route Aliases

| Path | Target | Notes |
|------|--------|-------|
| `/` | `MarketingPage` | Primary marketing entry |
| `/welcome` | `MarketingPage` | Legacy alias — preserved for old links/bookmarks |
| `/lite` | Legacy alias only | Redirects to `/app` after completed local onboarding, otherwise redirects to `/onboarding` |
| `/entry` | `EntryPage` | PWA entry point — evaluates standalone mode |
| `/auth` | Auth flow | Login / magic-link |
| `/app` | Main app (guarded) | Requires auth — redirects via `ProfileGuard` |

---

## Implementation Details

### `EntryPage.tsx`

Handles the `/entry` route. Evaluates `isStandaloneDisplayMode()`.
- If `true` → unauthenticated guest users proceed directly to `/app` (guest mode)
- If `false` → redirect to `/` (MarketingPage)
- Legacy `entry=lite` links redirect to `/onboarding`, not `/lite`

### `/lite` Legacy Alias Only

`/lite` is a **Legacy alias only** route. It redirects users with completed local onboarding to `/app`; all other users redirect to `/onboarding`.

`/lite` MUST NOT import or render `FullscreenAgent`. The Burning Bush / companion agent must remain a floating PiP control inside the real app, not a routed full-page destination.

### `ProfileGuard.tsx`

Wraps all internal app routes (`/app`, `/daily`, etc.) in `App.tsx`.
If an unauthenticated user hits a guarded route directly:
- Standalone/PWA → allowed through (guest mode; no redirect to `/auth`)
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
| 2.1.1 | 2026-06-28 | Converted `/lite` to a legacy redirect alias only. Documented that `/lite` must never import or render `FullscreenAgent`, and that legacy `entry=lite` links redirect to `/onboarding`. |
| 2.1.0 | 2026-06-16 | Updated PWA routing to reflect guest-mode-first implementation. Standalone unauthenticated users now go to `/app` (guest mode), not `/auth`. ProfileGuard allows PWA users through. Aligns with README and MISSION. |
| 2.0.1 | 2026-06-16 | Added `/welcome` alias, `/lite` burning-bush preview route, HIDDEN_PATHS table, and versioning header. |
| 2.0.0 | 2026-06-10 | Initial routing rules document. |
