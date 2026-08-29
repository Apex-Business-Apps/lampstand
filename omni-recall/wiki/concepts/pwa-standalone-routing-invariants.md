# Concept: PWA Standalone Routing Invariants

## Core Routing Invariants (`docs/ROUTING_RULES.md` & `ProfileGuard.tsx`)

1. **Installed PWA Users (Standalone Display Mode)**:
   - Must open directly into the core app (`/app`, `/daily`, etc.) as local guests without seeing the marketing landing page or mandatory auth gates.
2. **Standard Web Browser Visitors**:
   - Land on `/` (`MarketingPage`) to discover features, listen to the anthem, and enter guest mode via 1-click CTA.
3. **Deep Route Protection**:
   - `ProfileGuard` verifies `profile || user || isStandaloneDisplayMode()` before granting access to protected routes, redirecting unauthenticated browser traffic to `/`.

## Consequence for Debugging

Because standalone traffic enters `/app` directly as a local guest, the installed PWA is the first surface to read every persisted record on first paint. A browser visitor lands on `/` (`MarketingPage`), which reads almost nothing from storage. A crash that appears only in the installed app and not on desktop is therefore far more likely to be device-local data than platform-specific code. Check the store before suspecting the platform. See `wiki/corrections/persisted-null-crashes-installed-pwa.md`.
