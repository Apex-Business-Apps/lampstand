# Ingestion: Android PWA crash investigation

## Date: 2026-08-29
## Source: Founder screenshot of the installed Android PWA plus live repository and production inspection.

## Artifacts Promoted
- `wiki/corrections/persisted-null-crashes-installed-pwa.md` (regression that can recur)
- `wiki/decisions/adr-008-trusted-local-storage-boundary.md` and `decisions.md` ADR-012 (runtime contract)
- `constraints.md` section 3 (canonical standard)
- `debugging-history.md` entry 9 (root cause record)
- `logs/health_checks/2026-08-29-pwa-storage-boundary-verification.md` (machine evidence)
- `wiki/open_loops/service-worker-precache-on-install.md`, `wiki/open_loops/error-boundary-local-diagnostics.md` (deferred, out of blast radius)

## Structural Corrections
- Created `logs/` with `correction_ledger/`, `health_checks/`, and `ingestion/`. The master blueprint documented this tree and named three files inside it, but the directory did not exist in the repository, so an agent following the blueprint would have cited sources that were never there. Root cause: the bare `logs` rule in `.gitignore` matches a directory of that name at any depth, so anything written to `omni-recall/logs/` was silently excluded from every commit. Added `!omni-recall/logs/` and replaced the three phantom filenames in the blueprint with the records that now exist.
- Added `wiki/decisions/README.md` mapping the directory's ADR numbering to `decisions.md`, which had diverged (directory `adr-005` is `decisions.md` ADR-007, directory `adr-006` is ADR-010, directory `adr-007` is ADR-009).
- Corrected `docs/ROUTING_RULES.md`, whose route table still claimed `/app` requires auth, contradicting the standalone guest rule stated directly above it.
