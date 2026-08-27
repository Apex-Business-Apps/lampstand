# Quality Bar

Every deliverable in TheLampStand must satisfy the highest enterprise SaaS standards:

## 1. Machine Verification
- **ESLint**: Zero errors and zero warnings (`npm run lint` → exit 0).
- **TypeScript**: Strict mode enabled with zero type errors.
- **Unit & Integration Tests**: 100% pass rate across all Vitest suites (`npm test` → exit 0).
- **Playwright E2E**: 100% pass rate across all specs (`npm run test:e2e` → exit 0).
- **Production Build**: Clean bundle compilation under 30s with zero unresolved imports (`npm run build` → exit 0).

## 2. Pastoral & Theological Tone
- Grounded in a theology of the cross: still, reverent, empathetic, and scripture-first.
- Strictly zero generic AI platitudes, motivational cliches, or superficial conversational filler.
- Verified chapter and verse citations required on all pastoral outputs.

## 3. Performance & Privacy
- Offline-first: core prayer, scripture, sermon, and journal workflows must execute without network access.
- Local-first persistence: all journal entries and preferences remain in client storage unless explicit user consent is given for cloud sync.
- Fast Core Web Vitals: sub-second time-to-interactive, zero font-FOUT cumulative layout shift.
