# Architecture Node: Visual Layer Stack

## Layer Hierarchy (`docs/LAYER_STACK.md` & `MarketingPage.tsx`)

```
Layer Stack (Bottom -> Top):
┌────────────────────────────────────────────────────────────────────────┐
│ z-0    Bible page texture (Below the veil, cursor glow reveal only)    │
│ z-10   Cross silhouette (Below the veil, cursor glow reveal only)      │
│ ────────────────────────────────────────────────────────────────────── │
│ z-100  CandleRevealCanvas (The veil mask: obsidian + dynamic glow)    │
│ ────────────────────────────────────────────────────────────────────── │
│ z-150  LampstandCanvas (Golden lampstand glow: always visible)         │
│ z-200  Hero Text / CTAs / Wordmark Header / Below-Fold Cards           │
│ ────────────────────────────────────────────────────────────────────── │
│ z-500  ConsentModal / Dialog Portals / Fullscreen Modals               │
│ z-500  BrandAnthemPlayer (Sticky bottom-left audio controller)         │
└────────────────────────────────────────────────────────────────────────┘
```

## Critical Rules
- Modals, Dialogs, and Overlays must use `z-[500]` to avoid clipping beneath canvas veils.
- Header branding uses `/images/wordmark-logo.png` (`h-8` on desktop, `h-7` on mobile) at `z-[200]`.
