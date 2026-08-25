# Rollback Plan

## Changed Files and Risk
- `src/lib/runtime/agentRuntime.ts`: Core runtime pipeline. Roll back by reverting this file.
- `src/hooks/useAgentController.ts`: Canonical agent hook. Roll back by reverting this file.
- `src/pages/GuidancePage.tsx`: Guidance surface. Roll back by reverting this file.
- `src/lib/agent/Grounding.ts`: Pure helper module. Roll back by reverting this file.
- `src/lib/agent/Prompts.ts`: System prompt definitions. Roll back by reverting this file.
- `src/lib/guidance/contextAssembler.ts`: Context length cap definition. Roll back by reverting this file.
- `src/lib/resonance/ResonanceEngine.ts`: On-device personalization engine. Roll back by reverting this file.
- `src/lib/storage.ts`: Local persistence operations. Roll back by reverting this file.
- `src/workers/static-spa.ts`: Cloudflare worker. Roll back by reverting this file.
- `src/test/*`: Test files. Roll back with source changes.
- `docs/apex/*.md`: Documentation files. Roll back by deleting or reverting docs.

## Rollback Command
- Full rollback after merge: `git revert <commit-sha>`.
- Local rollback before merge: `git reset --hard HEAD~1`.

## Data Migration Notes
- No database migration was added or changed.
- Local storage schema remains backward-compatible JSON keys and object shapes.
- No remote schema changes to reverse.

## Smoke Test After Rollback
1. `npm run typecheck`
2. `npm test`
3. `npm run build`
4. Open `/app`, `/daily`, `/guidance`, `/saved`, `/journal`, and `/health`.
