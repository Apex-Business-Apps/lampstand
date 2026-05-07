# Performance Report

## Changes
- AI input is normalized and capped at 1,200 characters in `src/lib/agent/Grounding.ts`.
- AI scripture context is capped to 3 passages and 1,800 context characters in `src/lib/agent/Grounding.ts`.
- Retrieval requests are bounded to top 3 in `src/lib/agent/RetrievalOrchestrator.ts`.
- Local retrieval caps `topK` between 1 and 5 in `src/lib/adapters.ts`.
- Saved passages are bounded to 200 local records and journal entries to 500 local records in `src/lib/storage.ts`.
- Safety events remain bounded to 100 records in `src/lib/storage.ts` with duplicate prevention.
- The `/health` endpoint returns before static asset lookup in `src/workers/static-spa.ts`.

## Dependency and Bundle Impact
- No runtime dependency was added.
- New code is local TypeScript only.
- Build completed successfully with Vite.
