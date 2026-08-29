# Decision Records

## Two numbering schemes, one mapping

`omni-recall/decisions.md` is the narrative register and numbers decisions in the order they were taken. The files in this directory were created later and carry their own sequence. The two numbers do not match, and reading either one as authoritative for the other is the single most likely source of drift in this memory system.

Cite decisions by their **title**, not by a bare number. When a number is unavoidable, resolve it here first.

| This directory | `decisions.md` | Subject |
|---|---|---|
| `adr-001-mission-lock-zero-monetization.md` | ADR-001 | Zero-cost, zero-telemetry mission lock |
| `adr-002-local-first-bundled-scriptures.md` | ADR-002 | Local-first deterministic fallbacks |
| `adr-003-unified-agent-controller.md` | ADR-003 | Single unified agent state machine |
| `adr-004-standardized-bounds.md` | ADR-004 | Standardized input and context bounds |
| `adr-005-geo-and-authority-schema.md` | ADR-007 | GEO and authority schema architecture |
| `adr-006-brand-unification-and-typography.md` | ADR-010 | Brand unification and zero em-dash typography |
| `adr-007-desktop-sanctuary-and-pwa.md` | ADR-009 | Responsive desktop sanctuary and PWA hooks |
| `adr-008-trusted-local-storage-boundary.md` | ADR-012 | Trusted local storage boundary |

Decisions recorded only in `decisions.md`, with no node in this directory: ADR-005 (clause-level AI filler sanitization), ADR-006 (abbreviation-tolerant citation grounding), ADR-008 (canonical crisis safety pipeline), ADR-011 (expanded scripture catalog).

## Adding a decision
Add the node here, add the narrative entry to `decisions.md`, then add the row above. All three, or the next agent inherits drift.
