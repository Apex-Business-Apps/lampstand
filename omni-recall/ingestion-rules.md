# Ingestion Rules & Lifecycle

## Ingestion Hierarchy

1. **Raw Artifacts (`raw/`)**: Immutable snapshots of transcripts, git commit logs, founder briefs, and external requirements.
2. **Logs (`logs/`)**: Operational records including the correction ledger, health check runs, and ingestion reports.
3. **Wiki (`wiki/`)**: Curated, structured architectural knowledge nodes, ADRs, core directives, concepts, and source indexes.
4. **State (`state/`)**: Current status checkpoints reflecting the active, verified reality of the codebase.

## Promotion Criteria

A finding or fix is promoted from a transient log into durable wiki memory if:
- It alters an architectural boundary or runtime contract.
- It fixes a regression that could recur in future development.
- It defines a canonical standard (e.g., typography, branding, safety).
- It represents a founder decision (ADR).
