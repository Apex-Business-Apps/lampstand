# LampStand Critical Routing Architecture

**WARNING: DO NOT DRIFT OR MODIFY THIS BEHAVIOR UNLESS EXPLICITLY AUTHORIZED BY THE FOUNDER.**

## The Core Rule
The entry routing is strictly bifurcated based on the user's platform context (Browser vs. PWA).

1. **Browser Users (Standard Web Visit)**
   - **Rule:** When a user types the URL (`thelampstand.icu`) in a browser or attempts to directly access `/app` without being logged in, they **MUST** land on the Marketing Page (`/welcome`).
   - **Why:** To properly introduce the product, convert traffic, and outline the value proposition before presenting login/signup forms.

2. **App Users (Installed PWA / Standalone Visit)**
   - **Rule:** When a user opens the installed app (standalone display mode) and they are not logged in, they **MUST** bypass the Marketing Page entirely and go straight into the Login Page (`/auth`).
   - **Why:** People opening the installed app have already been converted. They do not need to be marketed to; they just need to log back in.

## Implementation Details

### 1. `EntryPage.tsx`
Handles the root route `/`. It evaluates the `isStandaloneDisplayMode()` helper. If true, it explicitly navigates unauthenticated users to `/auth`. If false, it navigates them to `/welcome`.

### 2. `ProfileGuard.tsx`
Wraps all internal app routes (`/app`, `/daily`, etc.) in `App.tsx`. If an unauthenticated user attempts to hit these routes directly:
- It checks `isStandaloneDisplayMode()`.
- If standalone/PWA, it intercepts and redirects to `/auth`.
- If standard browser, it intercepts and redirects to `/welcome`.

**Future Agents and Developers:** Do not remove the `ProfileGuard` from core app routes, and do not remove the standalone checks in these components.
