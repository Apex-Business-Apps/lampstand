# TheLampStand Omni-Recall Master Blueprint

*Release Date: August 27, 2026*
*Platform: Google Antigravity IDE / APEX Operating System*

## 1. System Vision & Purpose

Omni-Recall serves as the permanent institutional memory, architectural compass, and regression shield for TheLampStand. It bridges development sessions, records immutable facts, prevents decision drift, and guarantees that every agent operates with full situational awareness.

---

## 2. Directory Layout & Ontology

```
omni-recall/
├── start-here.md
├── default-use-rule.md
├── do-not-do.md
├── quality-bar.md
├── user-operating-model.md
├── ingestion-rules.md
├── omni-recall-master-blueprint-2026-08-27.md
├── architecture.md
├── constraints.md
├── content-catalog.md
├── debugging-history.md
├── decisions.md
├── state/
│   └── checkpoints/
│       └── current-status.md
├── logs/
│   ├── correction_ledger/
│   │   ├── template.md
│   │   └── 2026-08-27-e2e-and-lint-remediation.md
│   ├── health_checks/
│   │   └── 2026-08-27-pr115-verification.md
│   └── ingestion/
│       └── 2026-08-27-repo-baseline-ingestion.md
├── wiki/
│   ├── _core_directives/
│   │   ├── thelampstand-core-directives.md
│   │   └── omni-recall-core-directives.md
│   ├── architecture_nodes/
│   │   ├── agent-runtime-pipeline.md
│   │   ├── storage-and-sync.md
│   │   ├── resonance-engine.md
│   │   ├── edge-worker-and-security.md
│   │   ├── visual-layer-stack.md
│   │   └── geo-and-seo-architecture.md
│   ├── concepts/
│   │   ├── theology-of-the-cross-pastoral-framing.md
│   │   ├── offline-first-scripture-grounding.md
│   │   ├── gentle-mode-neurodivergent-alignment.md
│   │   └── pwa-standalone-routing-invariants.md
│   ├── corrections/
│   │   ├── README.md
│   │   ├── eslint-prefer-const-grounding.md
│   │   ├── playwright-strict-mode-guidance-locator.md
│   │   ├── filler-sanitization-vs-whole-response-rejection.md
│   │   ├── abbreviation-tolerant-scripture-citation.md
│   │   └── marketing-page-usenavigate-reference-error.md
│   ├── decisions/
│   │   ├── adr-001-mission-lock-zero-monetization.md
│   │   ├── adr-002-local-first-bundled-scriptures.md
│   │   ├── adr-003-unified-agent-controller.md
│   │   ├── adr-004-standardized-bounds.md
│   │   ├── adr-005-geo-and-authority-schema.md
│   │   ├── adr-006-brand-unification-and-typography.md
│   │   └── adr-007-desktop-sanctuary-and-pwa.md
│   ├── open_loops/
│   │   ├── offline-multilingual-scripture-packs.md
│   │   ├── on-device-small-llm-webllm-fallback.md
│   │   └── parish-and-study-circle-export.md
│   ├── projects/
│   │   ├── thelampstand-v2-core.md
│   │   └── thelampstand-content-expansion.md
│   ├── rejected_patterns/
│   │   ├── subscription-paywalls-and-monetization.md
│   │   ├── third-party-analytics-telemetry.md
│   │   ├── em-dash-typography-in-ui-copy.md
│   │   └── independent-agent-page-state-machines.md
│   ├── source_indexes/
│   │   └── omni-recall-source-index.md
│   └── user_patterns/
│       └── thelampstand-user-patterns.md
└── raw/
    ├── chat_exports/
    ├── docs_and_briefs/
    ├── historical_exports/
    └── repo_history/
```

---

## 3. Maintenance Protocol

Every agent modifying the codebase must update:
1. `state/checkpoints/current-status.md` when PRs or major features land.
2. `logs/health_checks/` with full machine test logs.
3. `wiki/corrections/` whenever a bug or CI gate failure is resolved.
4. `wiki/decisions/` whenever architectural changes are introduced.
