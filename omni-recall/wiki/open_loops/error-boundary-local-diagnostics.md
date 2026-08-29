# Open Loop: Local diagnostics for ErrorBoundary crashes

## Status: Open
## Opened: 2026-08-29

## Observation
`src/components/ErrorBoundary.tsx` writes the failing error to `console.error` only. On an installed Android PWA there is no console within reach, so a founder-reported crash arrives as a screenshot of identical fallback copy regardless of cause. Diagnosing the 2026-08-29 crash required rebuilding the deployed bundle locally and fuzzing persisted state to find the throw.

## Constraint
Any solution must respect ADR-001: no telemetry, no PII, nothing leaves the device.

## Proposed approach
Keep the last error message and component stack in a capped local record, surfaced behind an explicit user action in Settings (for example a "copy diagnostics" control) so the user chooses to share it. No automatic transmission.
