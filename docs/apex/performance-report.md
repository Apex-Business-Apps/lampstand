# Performance Report

## Changes
- AI input is normalized and capped at 1,200 characters in `src/lib/agent/Grounding.ts` (`MAX_AI_INPUT_CHARS`).
- Guidance context assembly is capped at 600 characters in `src/lib/guidance/contextAssembler.ts` (`MAX_CONTEXT_CHARS`).
- Retrieval requests in `src/lib/runtime/agentRuntime.ts` are bounded to `topK: 5`.
- Local retrieval caps `topK` between 1 and 5 in `src/lib/adapters.ts`.
- Saved passages are bounded to 200 local records and journal entries to 500 local records in `src/lib/storage.ts`.
- Safety events remain bounded to 100 records in `src/lib/storage.ts` with duplicate prevention.
- The `/health` endpoint returns before static asset lookup in `src/workers/static-spa.ts`.

## Dependency and Bundle Impact
- No runtime dependency was added.
- New code is local TypeScript only.
- Build completed successfully with Vite.
