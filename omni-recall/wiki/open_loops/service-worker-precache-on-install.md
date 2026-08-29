# Open Loop: Precache the built shell assets on service worker install

## Status: Open
## Opened: 2026-08-29

## Observation
`public/sw.js` precaches only `/` during `install`. Hashed assets are cached opportunistically by the `/assets/` handler, which only runs once the worker controls the page. Measured on a fresh install: after the first load the cache held `/` and one image; from the second load onward it held the full entry, CSS, and route chunks.

Consequence: a first-ever launch that goes offline before a second controlled load renders a blank page, which contradicts ADR-002.

## Why it was not fixed in the 2026-08-29 pass
That pass was scoped to the crash in `wiki/corrections/persisted-null-crashes-installed-pwa.md`. Precaching correctly needs a generated asset manifest wired into the build, which is a build-pipeline change rather than a surgical one.

## Proposed approach
Emit the built asset list at build time (a `postbuild` step alongside `scripts/inject-modulepreload.mjs`) and have `install` add the entry chunk and CSS from it, keeping the existing runtime cache for lazy routes.
