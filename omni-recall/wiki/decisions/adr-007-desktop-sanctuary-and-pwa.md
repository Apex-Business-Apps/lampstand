# ADR-007: Responsive Desktop Sanctuary and PWA Distribution Hooks

## Status: Accepted

## Context
Many prayer and devotional apps are restricted to narrow mobile viewports, degrading the desktop study experience.

## Decision
1. Responsive side-rail navigation and expanded reading surface (`max-w-4xl`) on viewports ≥768px (`AppShell.tsx`).
2. PWA app shortcuts registered in `manifest.json`.
3. Lock-screen `MediaSession` metadata during audio reflection playback.

## Consequences
Delivers an expansive desktop devotional sanctuary while maintaining a lightweight PWA footprint.
