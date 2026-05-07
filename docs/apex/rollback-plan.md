# Rollback Plan

## Changed Files and Risk
- `src/lib/agent/Grounding.ts`: Low risk, additive pure helper module. Roll back by deleting file and reverting imports/usages in `ConversationOrchestrator.ts`.
- `src/lib/agent/ConversationOrchestrator.ts`: Medium risk, changes AI response assembly and fallback behavior. Roll back by reverting this file to the previous commit.
- `src/lib/agent/RetrievalOrchestrator.ts`: Low risk, increases bounded retrieval from 1 to 3 and handles empty input. Roll back by restoring topK 1 behavior.
- `src/lib/adapters.ts`: Medium risk, no-match retrieval no longer returns random fallback passage. Roll back by restoring random fallback branch.
- `src/lib/storage.ts`: Medium risk, changes local idempotency and list caps. Roll back by reverting this file. Local data remains JSON-compatible.
- `src/workers/static-spa.ts`: Low risk, additive `/health` route. Roll back by removing `jsonHealthResponse` and the `/health` branch.
- `src/pages/TermsPage.tsx`, `src/pages/CompanyPage.tsx`, `src/pages/AcceptableUsePage.tsx`, `src/pages/PrivacyPolicyPage.tsx`: Low risk, removes deferred legal placeholder language from rendered pages. Roll back by reverting these text changes.
- `src/test/ai-grounding.test.ts`, `src/test/storage-idempotency.test.ts`, `src/test/worker-health.test.ts`, `src/test/retrieval-orchestrator.test.ts`: Low risk, test-only. Roll back with source changes.
- `docs/apex/*.md`: Low risk, documentation-only. Roll back by deleting or reverting docs.

## Rollback Command
- Full rollback after merge: `git revert <commit-sha>`.
- Local rollback before merge: `git reset --hard HEAD~1` if this commit is the only local commit.

## Data Migration Notes
- No database migration was added.
- Local storage schema remains the same JSON keys and object shapes.
- Saved passages and journals are capped only on future writes; existing data is not destructively migrated at boot.

## Smoke Test After Rollback
1. `npm run typecheck`
2. `npm test`
3. `npm run build`
4. Open `/app`, `/daily`, `/saved`, `/journal`, and `/health` if the health route is retained.
