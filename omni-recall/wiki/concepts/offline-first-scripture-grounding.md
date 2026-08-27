# Concept: Offline-First Scripture Grounding

## Core Concept
All canonical Scripture passages, Daily Light readings, sermon outlines, and prayer guides are statically bundled in client memory (`src/data/seed.ts`, `src/data/contentLibrary.ts`, `src/data/sermonLibrary.ts`).

## Grounding Guarantee
- **No Remote Retrieval Required**: The app never fails because a remote API is down or the user is on airplane mode.
- **Zero Hallucinated Verses**: The LLM prompt specifically injects retrieved canonical passages and forbids rewriting or making up Scripture.
- **Abbreviation Tolerance**: `hasScriptureCitation()` supports canonical biblical abbreviations (e.g. `Jn 3:16`, `Phil 4:6-7`, `Ps 23:1-6`) across Old and New Testaments.
