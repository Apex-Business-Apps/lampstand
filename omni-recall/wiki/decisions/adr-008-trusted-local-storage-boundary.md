# ADR-008: Trusted Local Storage Boundary

## Status: Accepted

## Context
TheLampStand is local-first, so `localStorage` holds every profile, preference, consent, knowledge, and presence record the UI reads on first paint. That store is untrusted input: it outlives app versions and schema changes, survives interrupted writes, and is shared with anything else on the origin. Consumers dereference the storage getters directly, so a single value of the wrong shape crashed the entire React tree into the ErrorBoundary on installed PWAs. Fixing individual call sites twice did not remove the class of bug.

## Decision
1. `src/lib/storage.ts` owns exactly one read boundary and one write boundary. No module reads or writes `localStorage` for these records directly.
2. A getter must never return a value that is not the shape it declares. A persisted `null` or `undefined`, or a value whose shape drifted from the declared default, resolves to the default.
3. A partial legacy record is completed from the current defaults, so adding a field to a default never leaves an installed device with `undefined`.
4. Writes are best effort. A full or disabled store degrades to in-memory behaviour and never throws through a React render.
5. Every getter with a non-null default is covered by the corruption matrix in `src/test/storage-corruption-boundary.test.ts`. Adding a getter means adding it there.

## Consequences
Store corruption degrades to defaults and self-heals on the next write instead of taking the app down. Devices already holding a corrupt record recover on next launch without the user clearing data. The cost is that a genuinely unreadable record is silently replaced by its default rather than surfacing an error, which is the correct trade for a device-local, zero-telemetry app.
