# LampStand — UI Layer Stack (z-index Reference)

**Version:** 2.1.0  
**Last updated:** 2026-06-16  
**Maintained by:** APEX Business Systems Ltd.  
**Status:** Authoritative — all contributors MUST follow this specification.

---

## Overview

LampStand's marketing page uses a custom canvas-based visual system that places
`CandleRevealCanvas` (an obsidian mask with cursor-tracked amber reveal) at
`z-index: 100`. All UI elements must be correctly positioned relative to this
veil to render correctly. Modal/dialog primitives used to default to `z-index: 50`
(Tailwind `z-50`), which caused them to render **behind** the veil — invisible to
the user. This document defines the authoritative stacking order and enforces
correct values across all UI primitives.

---

## Canonical Layer Stack

```
z-index  │  Component(s)                    │  Description
─────────┼─────────────────────────────────┼──────────────────────────────────────
  0      │  bible_page.png                 │  Bible texture — BELOW THE VEIL
  10     │  cross_alpha.png                │  Cross silhouette — BELOW THE VEIL
─────────┼─────────────────────────────────┼──────────────────────────────────────
  100    │  CandleRevealCanvas             │  ⚑ THE VEIL — obsidian mask + glow
─────────┼─────────────────────────────────┼──────────────────────────────────────
  150    │  LampstandCanvas                │  Lamp hero video — ABOVE THE VEIL
  200    │  MarketingPage header           │  Wordmark + Log In button
  200    │  MarketingPage hero (text+CTA)  │  "Walk with the Light" copy + buttons
  200    │  MarketingPage below-fold       │  Feature cards, footer
─────────┼─────────────────────────────────┼──────────────────────────────────────
  300    │  FloatingAgent (mini-collapsed) │  Flame FAB, bottom-right corner
  300    │  FloatingAgent (mini-expanded)  │  Companion widget, bottom-right corner
─────────┼─────────────────────────────────┼──────────────────────────────────────
  500    │  Dialog overlay + content       │  ConsentModal, all app dialogs
  500    │  AlertDialog overlay + content  │  Destructive confirmations
  500    │  Sheet overlay + content        │  Slide-in panels
  500    │  Drawer overlay + content       │  Bottom drawers
  500    │  Toast viewport                 │  Notification toasts
─────────┴─────────────────────────────────┴──────────────────────────────────────
```

> **The gap between z-300 and z-500 is intentional.** It reserves space for any
> future overlay tier (e.g. tutorial tooltips, achievement badges) that must
> clear FloatingAgent but not interrupt critical modals.

---

## Invariants — NEVER violate these

1. **z-[100] is owned exclusively by `CandleRevealCanvas`.** Do not assign any
   other component to this value. Do not change CandleRevealCanvas's z-index.

2. **Nothing below z-[100] may be visible on the marketing page.** The bible
   page texture and cross silhouette exist below the veil by design — the veil
   hides them and the cursor-tracked reveal "punches through" to expose them.

3. **All Radix UI / shadcn modal primitives MUST use z-[500].** The Tailwind
   default `z-50` (= 50) is far below CandleRevealCanvas (100). Every time
   shadcn is upgraded, verify that overlay classes have NOT been silently
   reverted to `z-50`. The `LAYER-GUARD` comments at the top of each file
   serve as regression markers — if they are missing, something was overwritten.

4. **FloatingAgent must stay below z-[400].** It must not overlap modal overlays
   during consent, dialogs, or confirmations.

5. **MarketingPage elements must stay at z-[200] or higher.** Lowering any
   marketing element below z-[100] will hide it permanently behind the veil.

6. **LampstandCanvas must remain at z-[150].** It sits above the veil but below
   marketing text. Changing this breaks the visual layer order on the hero.

---

## Files Implementing This Stack

| File | z-index(es) | Notes |
|------|------------|-------|
| `src/components/CandleRevealCanvas.tsx` | z-[100] | THE VEIL — do not touch |
| `src/components/LampstandCanvas.tsx` | z-[150] | Lamp hero video wrapper |
| `src/pages/MarketingPage.tsx` | z-[200], z-[500] | Header, hero, below-fold; hosts ConsentModal (Portal→body) |
| `src/components/FloatingAgent.tsx` | z-[300] | Mini FAB + widget |
| `src/components/ui/dialog.tsx` | z-[500] | Overlay + content |
| `src/components/ui/alert-dialog.tsx` | z-[500] | Overlay + content |
| `src/components/ui/sheet.tsx` | z-[500] | Overlay + content |
| `src/components/ui/drawer.tsx` | z-[500] | Overlay + content |
| `src/components/ui/toast.tsx` | z-[500] | Viewport |

---

## Shadcn Upgrade Checklist

When running `shadcn add` or manually upgrading any UI primitive:

- [ ] `dialog.tsx` — confirm `DialogOverlay` and `DialogContent` both use `z-[500]`
- [ ] `alert-dialog.tsx` — confirm `AlertDialogOverlay` and `AlertDialogContent` both use `z-[500]`
- [ ] `sheet.tsx` — confirm `SheetOverlay` and `SheetContent` both use `z-[500]`
- [ ] `drawer.tsx` — confirm `DrawerOverlay` and `DrawerContent` both use `z-[500]`
- [ ] `toast.tsx` — confirm `ToastViewport` uses `z-[500]`
- [ ] Verify `LAYER-GUARD` comment is present at top of each patched component
- [ ] Run `npm run test` and confirm `floating-agent.test.tsx` passes

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 2.1.1 | 2026-06-16 | Scope ConsentModal to MarketingPage only (moved from App.tsx global to MarketingPage.tsx). Fixes modal firing on non-hero routes (/auth, /app, etc.). Fixed layer comment in MarketingPage.tsx: z-310 → z-500. |
| 2.1.0 | 2026-06-16 | Bump all modal primitives from z-50 → z-[500]. Root cause: ConsentModal rendered behind CandleRevealCanvas (z-[100]). Added LAYER-GUARD comments and this document. |
| 2.0.0 | 2026-06-10 | Initial layer stack documentation. CandleRevealCanvas introduced at z-[100]. |
