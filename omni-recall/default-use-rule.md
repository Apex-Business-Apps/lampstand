# Default Use Rule

Omni-Recall is the authoritative continuity system for TheLampStand.

## Operating Principles

1. **Automatic Recall**: Before implementing features or refactoring code, inspect `omni-recall/` for architectural boundaries, prior decisions (ADRs), rejected patterns, and verified debugging history.
2. **Deterministic Grounding**: When facts, limits, or constraints are established in `omni-recall/`, do not contradict them without explicit justification and machine-verified evidence.
3. **Compound Learning**: When resolving a bug or receiving a founder directive, immediately record the root cause and regression shield into `omni-recall/wiki/corrections/` and `omni-recall/logs/correction_ledger/`.
4. **Canonical State Truth**: The state documented in `omni-recall/state/checkpoints/current-status.md` must accurately reflect the latest merged branch on `main`.
