# Rollback Plan

This document covers all changes across all enhancement passes. Roll back in reverse-chronological order.

---

## Phase 1 — Contextual Guidance Memory (2026-05-17)

### Changed Files and Risk

- `src/lib/guidance/contextAssembler.ts` (new): Low risk, additive pure module. Roll back by deleting the file and removing its import from `agentRuntime.ts`.
- `src/lib/runtime/agentRuntime.ts`: Medium risk, fixes retrieval discard bug, adds Resonance passage ranking and context threading. Roll back by reverting this file to the previous commit. The retrieval discard bug will return; no data is lost.
- `src/lib/groq.ts`: Medium risk, replaces system prompt and adds `generateGuidanceWithContext()`. Roll back by reverting this file. The old vague SYS prompt returns; no data is lost.
- `src/test/guidance-context.test.ts` (new): Low risk, test-only. Delete along with `contextAssembler.ts`.

### Rollback Command

```bash
git revert ad69519   # Phase 1 commit hash
```

Or local rollback before merge:

```bash
git reset --hard HEAD~1
```

### Data Notes

- No storage schema changes. No migration needed.
- Rollback restores the retrieval discard bug but no user data is affected.

### Smoke Test After Rollback

1. `npm run typecheck`
2. `npm run test`
3. `npm run build`
4. Open `/guidance`, submit a concern, verify a pastoral response appears.
5. Open `/daily`, verify passage and reflection load.

---

## Prior Pass — Grounding, Idempotency, Health (2026-05-07 and earlier)

### Changed Files and Risk

- `src/lib/agent/Grounding.ts`: Low risk, additive pure helper module. Roll back by deleting file and reverting imports in `ConversationOrchestrator.ts` (note: this entire stack is currently orphaned).
- `src/lib/agent/ConversationOrchestrator.ts`: Medium risk, changes AI response assembly in the orphaned stack. Roll back by reverting this file.
- `src/lib/agent/RetrievalOrchestrator.ts`: Low risk, bounded retrieval. Roll back by restoring topK 1 behavior.
- `src/lib/adapters.ts`: Medium risk, no-match retrieval no longer returns random fallback passage. Roll back by restoring random fallback branch.
- `src/lib/storage.ts`: Medium risk, idempotency and list caps. Roll back by reverting the file. Local data remains JSON-compatible. Existing data is not destructively modified.
- `src/workers/static-spa.ts`: Low risk, additive `/health` route. Roll back by removing the health branch.
- `src/pages/TermsPage.tsx`, `src/pages/CompanyPage.tsx`, `src/pages/AcceptableUsePage.tsx`, `src/pages/PrivacyPolicyPage.tsx`: Low risk, removes deferred legal placeholder language. Roll back by reverting these files.
- `src/test/ai-grounding.test.ts`, `src/test/storage-idempotency.test.ts`, `src/test/worker-health.test.ts`, `src/test/retrieval-orchestrator.test.ts`: Low risk, test-only.
- `docs/apex/*.md`: Documentation-only.

### Rollback Command

```bash
git revert <prior-pass-commit-sha>
```

### Data Migration Notes

- No database migration was added in any pass.
- Local storage schema remains compatible JSON — same keys and object shapes throughout.
- Saved passages and journals are capped only on future writes; existing records are not deleted at boot.

### Smoke Test After Any Rollback

1. `npm run typecheck`
2. `npm run test`
3. `npm run build`
4. Open `/app`, `/daily`, `/guidance`, `/saved`, `/journal`.
5. Submit a concern in `/guidance` and verify pastoral response.
6. Confirm `/health` returns `{"status":"ok"}` if the health route is still present.
