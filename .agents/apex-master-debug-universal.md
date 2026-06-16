---
name: apex-master-debug
version: 2.0.0
description: >
  TheLampStand-MASTER-DEBUG v2: Omnipotent, Omniscient, Predictive Debugging Intelligence.
  Upgraded with Thinking Budget Allocation, Self-Consistency Cross-Check, Constitutional
  Fix Review, AI/LLM-specific debug patterns, and Phase 9 Trajectory Audit.
  Universal across ALL languages, frameworks, platforms. Zero loops. Zero guessing.
  Zero drift. Predict → Prevent → Fix in one pass.

  Triggers: debug, fix bug, error, crash, failing test, broken code, not working,
  exception, stack trace, troubleshoot, diagnose, investigate, predict bugs,
  proactive review, audit code health, pre-release check, refactor risk,
  performance issue, memory leak, race condition, silent failure, regression,
  AI hallucination, prompt injection, LLM drift, agent loop.

  Produces: Single surgical fix with 100% certainty, proactive elimination of future bugs,
  and a permanent regression shield.
license: Proprietary — TheLampStand Business Systems Ltd. Edmonton, AB, Canada.
compatibility: Claude, GPT-4o/o1/o3, Gemini, Llama, Mistral, DeepSeek, any LLM
---

# TheLampStand-MASTER-DEBUG v2.0

> **"Omniscient agents don't debug. They PREVENT. When they must fix — ONE pass, ONE change, DONE."**

---

## CONTRACT

```
Input  → Bug report | error | stack trace | code review request | "it doesn't work"
          | proactive scan | pre-release audit | performance complaint | AI/LLM behavior issue
Output → Surgical fix with zero guessing + proactive threat map of future failures
Success → Bug fixed in ONE change. Regression impossible. Future bugs predicted.
Fails  → Pre-flight not 100% green | root cause unproven | multiple simultaneous changes
```

---

## CORE DOCTRINE — THE IRON TRIAD

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PILLAR 1 — OMNISCIENCE:  Know the cause before acting. Always.            │
│  PILLAR 2 — OMNIPOTENCE:  One change. Complete fix. Zero side effects.     │
│  PILLAR 3 — PRECOGNITION: See the bug before it sees production.           │
│                                                                            │
│  ORDER: PREDICT → PREVENT → (if needed) FIX                               │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 0: THINKING BUDGET ALLOCATION — MANDATORY FIRST STEP

```
Declare depth BEFORE any analysis begins:

FAST   ⚡ → Obvious syntax error or config issue. Reproducible 100%.
            Time budget: <5 min. Protocol: Phases 1→3→7→8

STANDARD 🔷 → Logic error, incorrect output, failing test.
             Time budget: 15–30 min. Protocol: All 8 phases

DEEP   🔴 → Intermittent, race condition, performance regression,
            security vulnerability, data corruption.
            Time budget: 30–90 min. Protocol: All 8 + Phase P1–P5

OMEGA  🌑 → Systemic failure, unknown root cause after 2 attempts,
            AI/LLM behavioral issue, distributed system.
            Time budget: Unbounded. All phases + self-consistency + trajectory audit.

Output: [MODE: X] — [one-sentence rationale for mode selection]
```

---

## MODE ROUTER

```
What is your situation?
├─ "I have a live bug / error / crash"       → REACTIVE MODE  (Phase 1–8)
├─ "Review this code before I ship"          → PREDICTIVE MODE (Phase P1–P5)
├─ "Something is slow / degraded"            → PERFORMANCE MODE (Phase X1–X4)
├─ "AI / LLM is behaving unexpectedly"       → AI DEBUG MODE (Phase A1–A5)
└─ "I want a full system audit"              → OMEGA SCAN (All phases parallel)
```

---

# REACTIVE MODE — Bug Already Exists

## PHASE 1: SCOPE LOCK ⟨2 min hard limit⟩

```
REQUIRED ANSWERS (all 5 — no exceptions):
□ What EXACTLY is broken? (One sentence. No "and".)
□ What is the EXPECTED behavior?
□ What is the ACTUAL behavior?
□ When did it LAST work? (Commit hash / timestamp / "never")
□ What CHANGED since it last worked?

Can you answer ALL 5 with certainty?
├─ YES → Proceed to Phase 2
└─ NO  → STOP. Collect answers. DO NOT PROCEED.
```

Output Template:
```
SCOPE: [exact symptom — one sentence]
EXPECTED: [exact behavior]
ACTUAL: [exact behavior]
LAST GOOD: [timestamp/commit/never]
DELTA: [specific changes since last good state]
```

---

## PHASE 2: CONTEXT HARVEST ⟨5–15 min⟩

```
TIER 1 — ERROR EVIDENCE (mandatory)
□ Full stack trace — untruncated, exact copy
□ Exact error message — verbatim, not paraphrased
□ Error code, HTTP status, exit code if present
□ File path + line number of failure

TIER 2 — STATE EVIDENCE (mandatory)
□ Exact input / payload that triggers bug
□ Runtime environment (OS, language version, framework version)
□ Env vars and config active at time of failure
□ DB / API / cache state if applicable

TIER 3 — CODE EVIDENCE (mandatory)
□ Failing code block + 30 lines above/below
□ All functions/methods in blast radius
□ Git diff since last known-good commit
□ Existing tests (passing AND failing)

TIER 4 — TEMPORAL EVIDENCE (mandatory)
□ First appearance timestamp
□ Frequency: always / intermittent / rare
□ Reproduction conditions (triggers vs. non-triggers)
□ Recent deployments, dependency updates, migrations

Evidence Sufficiency Gate:
├─ Which exact line fails?            NO → Add logging, re-collect
├─ Which exact value causes failure?  NO → Inspect runtime state, re-collect
├─ Which exact condition triggers it? NO → Test variations, re-collect
└─ ALL YES → Proceed to Phase 3
```

---

## PHASE 3: TEMPORAL ROOT CAUSE ANALYSIS ⟨The TheLampStand Core⟩

**Travel through time. Find WHERE, WHEN, and WHY the invariant broke.**

### Step 3A — Build Causal Chain

```
Work BACKWARD from symptom to origin:

Symptom observed at → [Layer N]
    ↑ caused by what at → [Layer N-1]
    ↑ caused by what at → [Layer N-2]
    ↑ ... until you reach an IMMUTABLE ROOT

Do NOT stop at the first "cause." Keep asking "what caused THAT?"
until you reach the original invariant violation.
```

### Step 3B — Deduction Matrix

```
╔══════════════════════════════════════════════════════════╗
║  HYPOTHESIS → EVIDENCE → VERDICT                        ║
╠══════════════════════════════════════════════════════════╣
║  H1: [theory — the obvious surface cause]               ║
║    For:     [evidence supporting]                       ║
║    Against: [evidence contradicting]                    ║
║    Verdict: ✓ PROVEN | ✗ ELIMINATED | ? NEEDS DATA     ║
╠══════════════════════════════════════════════════════════╣
║  H2: [theory — upstream / feeding cause]                ║
║    For: [...] | Against: [...] | Verdict: ✓ | ✗ | ?   ║
╠══════════════════════════════════════════════════════════╣
║  H3: [theory — environmental / config cause]            ║
║    For: [...] | Against: [...] | Verdict: ✓ | ✗ | ?   ║
╠══════════════════════════════════════════════════════════╣
║  H4: [timing / concurrency] — if applicable             ║
║  H5: [integration / contract] — if applicable           ║
╚══════════════════════════════════════════════════════════╝

MINIMUM: 3 hypotheses. Generate more for complex/intermittent bugs.
```

### Step 3C — Self-Consistency Cross-Check (DEEP/OMEGA modes)

```
After deduction matrix produces a winner:

PATH A: Trace forward from your proven root cause. Does the symptom follow?
PATH B: Take an alternative root cause (H2 or H3). Does it also explain the symptom?

├─ Only PATH A explains the symptom → Root cause confirmed. Proceed.
├─ Both paths explain it equally   → Insufficient evidence. Return to Phase 2.
└─ Neither path explains it fully  → Causal chain is incomplete. Return to Phase 3A.

This cross-check eliminates pattern-matching from prior bugs (the "I've seen this before" trap).
```

### Root Cause Category Library

| Category | Subcauses to check |
|---|---|
| **Data** | null/undefined, wrong type, missing field, stale cache, encoding |
| **Logic** | off-by-one, wrong operator, inverted condition, unreachable branch |
| **State** | mutation leak, async race, lifecycle order, memory not released |
| **Config** | wrong env var, missing secret, dependency version mismatch |
| **Integration** | API contract change, timeout, auth expiry, schema drift |
| **Concurrency** | deadlock, race condition, thread starvation, atomic violation |
| **Resources** | OOM, disk full, connection pool exhausted, file descriptor leak |
| **Platform** | OS diff, browser compat, timezone, hardware architecture |
| **AI/LLM** | prompt injection, context contamination, output drift, hallucination → see Phase A |

### Certainty Gate (NON-NEGOTIABLE)

```
⛔ BLOCKED UNTIL ALL FOUR ARE TRUE:
□ Exactly ONE hypothesis remains with overwhelming evidence
□ You can explain WHY every other hypothesis is WRONG (not just less likely)
□ You can predict EXACTLY what the fix will change in the code
□ You can explain this bug to a teammate in ≤30 seconds
```

---

## PHASE 4: BLAST RADIUS MAPPING

```
Map BEFORE touching anything:
□ Every caller of the failing function/component
□ Every system depending on the broken contract
□ Every test affected (positively or negatively)
□ Every data artifact that may be corrupted
□ Every downstream consumer in APIs / queues / events

CLASSIFICATION:
├─ CONTAINED   → ≤1 component. Low risk. Proceed.
├─ MODERATE    → 2–5 components. Document all. Proceed with care.
├─ WIDESPREAD  → 6+ components. STOP. Coordinate fix.
└─ SYSTEMIC    → Architecture flaw. Local fix impossible. Re-architect.
```

---

## PHASE 5: MENTAL SIMULATION ENGINE

```
SIMULATION PASS 1 — FORWARD TRACE
├─ Apply your fix mentally at the root cause point
├─ Trace execution forward through all affected paths
└─ Does every path reach the correct expected outcome? YES/NO

SIMULATION PASS 2 — BACKWARD TRACE
├─ Start at the desired outcome
├─ What must be true for your fix to produce this?
└─ Are ALL preconditions guaranteed? YES/NO

SIMULATION PASS 3 — EDGE CASE SWEEP
□ Input is null / empty / undefined
□ Input is maximum size / boundary value
□ Function called zero / once / many times
□ Function called out of expected order
□ Network / IO / DB fails mid-execution
□ Concurrent calls hit simultaneously
□ Fix applied to stale/corrupted state

SIMULATION PASS 4 — REGRESSION PROBE
□ Does fix break any existing passing tests?
□ Does fix change any observable contract for callers?
□ Does fix introduce any performance regression?
□ Does fix require a data migration or schema change?
```

---

## PHASE 6: PRE-FLIGHT GATE

```
⛔ ALL must be GREEN. No exceptions. No "mostly."

╔══════════════════════════════════════════════════════════╗
║                  TheLampStand PRE-FLIGHT GATE                   ║
╠══════════════════════════════════════════════════════════╣
║  □ Scope locked (no drift from original problem)         ║
║  □ ALL evidence collected (no gaps, no assumptions)      ║
║  □ Root cause PROVEN with evidence (not theorized)       ║
║  □ ALL other hypotheses ELIMINATED with evidence         ║
║  □ Self-consistency cross-check PASSED (DEEP/OMEGA)      ║
║  □ Blast radius fully mapped                             ║
║  □ Mental simulation: ALL 4 passes complete and PASSED   ║
║  □ Edge cases: ALL checked and accounted for             ║
║  □ Fix is MINIMAL (smallest change that resolves root)   ║
║  □ Fix is SURGICAL (touches only what root cause demands)║
║  □ Rollback plan exists                                  ║
╠══════════════════════════════════════════════════════════╣
║  ALL GREEN? → Execute Phase 7                            ║
║  ANY RED?   → Return to appropriate phase. FULL STOP.   ║
╚══════════════════════════════════════════════════════════╝
```

---

## PHASE 7: CONSTITUTIONAL FIX REVIEW

**Before writing a single character, evaluate your fix against these 6 principles:**

```
□ FR1: Does this fix change ONLY what the proven root cause demands?
□ FR2: Is this the SMALLEST change that resolves the root cause?
□ FR3: Does this fix introduce ANY new dependency or behavior?
       NO → Proceed. YES → Justify or find a smaller fix.
□ FR4: Is the regression test written BEFORE applying the fix? (TDD-style)
□ FR5: Is the fix comment explicit about WHY (not just WHAT)?
□ FR6: Does this fix close the bug class, not just this instance?
       (Audit nearby code for the same pattern)

ALL 6 GREEN → Execute the fix.
ANY RED → Refine the fix approach. Do not proceed.
```

---

## PHASE 7B: SURGICAL EXECUTION

```
EXECUTION LAWS (violate = restart from Phase 1):
1. Smallest change that resolves the proven root cause
2. ONE logical change per commit — independently testable
3. If fix has multiple parts → each part is a separate commit
4. Comment WHY for any non-obvious line
5. Zero "while I'm here" improvements — fix the bug ONLY
6. Write the regression test BEFORE applying the fix (TDD)
```

Fix Comment Template:
```
// FIX: [issue ID or description]
// ROOT CAUSE: [one sentence — the proven WHY]
// CHANGE: [what this does differently and why it resolves root cause]
// REGRESSION TEST: [test name / location]
[minimal code change]
```

Post-Execution Validation:
```
□ Reproduction test now PASSES
□ All existing tests still PASS
□ No new warnings or errors in logs
□ Manual verification of expected behavior confirmed
□ Edge cases from simulation verified
□ Performance unchanged (or improved)
```

---

## PHASE 8: CLOSURE & REGRESSION SHIELD

```
□ Root cause documented in plain language
□ Regression test committed (catches if bug returns)
□ Similar patterns searched in codebase (same bug elsewhere?)
□ Contributing factor addressed at systemic level if applicable
□ Team notified of pattern / antipattern discovered
```

Closure Statement:
```
BUG CLOSED:
Root Cause:      [one sentence, plain language]
Fix Applied:     [file:line — what changed]
Regression Test: [test name / path]
Pattern Risk:    [none | low — where else might this lurk?]
Prevention Note: [one line — how to avoid this class of bug]
```

---

## PHASE 9: TRAJECTORY AUDIT (DEEP/OMEGA modes)

**After closure, audit the entire debug trace for systemic insights:**

```
□ How many phases were needed before reaching root cause?
  → If > 4 phases, evidence collection was insufficient in Phase 2
□ Did any hypothesis survive longer than warranted by available evidence?
  → If yes, confirmation bias likely — flag as team learning
□ Was the blast radius larger than initially estimated?
  → If yes, architecture has hidden coupling — document as tech debt
□ Did the fix require touching > 1 file?
  → If yes, the abstraction boundary is wrong — flag for refactor
□ Did the root cause belong to a category that has appeared before?
  → If yes, systemic process fix needed — escalate to architecture review
```

---

# PREDICTIVE MODE — Find Bugs Before They Exist

## PHASE P1: THREAT SURFACE SCAN

```
SCAN TARGETS:
□ Functions with no null checks on external inputs
□ Async operations without timeout or error handling
□ Mutable shared state accessed from multiple contexts
□ API calls without retry / circuit breaker
□ Auth checks that depend on order of execution
□ Type coercions that silently swallow errors
□ Loops with no termination guarantees
□ Resource allocations with no guaranteed release
□ Magic numbers / hardcoded values encoding business logic
□ Error paths that silently catch and continue
□ AI outputs passed downstream without validation
□ validateSafety() or equivalent that always returns safe
```

## PHASE P2: PATTERN RECOGNITION ENGINE

| Antipattern | Risk | Detection Signal | Remediation |
|---|---|---|---|
| Nested async > 3 levels | HIGH | > 3 nesting | Flatten with async/await |
| God function (> 50 lines) | HIGH | Cyclomatic > 10 | Decompose |
| Missing input validation at boundary | CRITICAL | Public API with no guard | Add validation layer |
| Empty catch blocks | HIGH | `catch {}` or `catch (e) {}` only | Explicit error strategy |
| Unguarded concurrent mutation | CRITICAL | Shared state, no lock | Mutex / immutability |
| Silent type coercion | MEDIUM | `==` not `===` | Strict typing |
| Stale closure / captured var | HIGH | Async + closure + loop | Capture explicitly |
| N+1 query pattern | HIGH | Query inside loop | Batch / eager load |
| Hardcoded URLs/keys in code | CRITICAL | Regex: `https://` or `sk-` in code | Externalize to env |
| Safety method that never blocks | CRITICAL | Returns true regardless of input | Fix or delete |

## PHASE P3: RISK SCORE + PRIORITY MAP

```
SEVERITY × LIKELIHOOD × BLAST_RADIUS = RISK_SCORE (1–100)

Severity:     Critical=4 | High=3 | Medium=2 | Low=1
Likelihood:   Certain=4  | Probable=3 | Possible=2 | Unlikely=1
Blast Radius: System=4   | Service=3  | Module=2   | Function=1

RISK_SCORE ≥ 30 → Fix before ship. No exceptions.
RISK_SCORE 15–29 → Fix in next sprint.
RISK_SCORE < 15  → Track in tech debt backlog.
```

## PHASE P4: PROACTIVE FIX GENERATION

```
For each RISK_SCORE ≥ 30 threat:
1. Apply Reactive Mode Phases 5–7 to the PREDICTED bug
2. Generate fix as if bug already occurred
3. Add test that would catch this in production
4. Commit as "PREVENTIVE: [threat description]"
```

## PHASE P5: PREDICTIVE CLOSURE REPORT

```
THREAT MAP:
┌────────────────────────────────────────────────────────┐
│ THREATS FOUND: [N]                                     │
│ CRITICAL (fix now):   [count] — [file:line list]       │
│ HIGH (fix this week): [count] — [file:line list]       │
│ MEDIUM (track):       [count] — [file:line list]       │
│ FIXES GENERATED:      [count] — ready to apply         │
│ TESTS ADDED:          [count] — regression shield      │
└────────────────────────────────────────────────────────┘
```

---

# AI DEBUG MODE — LLM / Agent Behavior Issues

## PHASE A1: AI SCOPE LOCK

```
□ What EXACTLY is the AI doing wrong?
  (e.g., "generates plausible-sounding but incorrect scripture references")
□ What is the expected behavior?
□ Is this deterministic (always wrong) or probabilistic (sometimes wrong)?
□ What is the input that triggers it?
□ What is the context / system prompt at the time of failure?
```

## PHASE A2: AI ROOT CAUSE TAXONOMY

```
Which category best describes the failure?

HALLUCINATION      → AI generating factually incorrect but confident output
                     Fix: RAG grounding, output validation, retrieval-augmented checks

PROMPT INJECTION   → User input overriding system instructions
                     Fix: Input sanitization, injection pattern detection, constitutional guardrails

CONTEXT CONTAMINATION → Earlier conversation turns corrupting current response
                     Fix: Context window management, session isolation, explicit system re-injection

OUTPUT DRIFT       → AI behavior degrading over time or conversation length
                     Fix: Session reset, context summarization, re-grounding injection

SCOPE VIOLATION    → AI answering questions outside its defined domain
                     Fix: Out-of-scope detection layer, explicit refusal training

SAFETY BYPASS      → AI safety checks not firing when they should
                     Fix: Audit safety function — check if it is dead code (always returns safe)

INFINITE LOOP      → Agent repeatedly calling tools without making progress
                     Fix: Step counter + max-iterations hard stop

TONE DRIFT         → AI response tone/persona deviating from constitution
                     Fix: Tone enforcement in output post-processing
```

## PHASE A3: AI EVIDENCE HARVEST

```
□ Full input to the AI (verbatim — not paraphrased)
□ Full output from the AI (verbatim)
□ System prompt / instructions active at that moment
□ Any previous turns in the conversation that may contaminate context
□ Which adapter/model produced the output (local vs. external)
□ Is the safety layer being called? Is it dead code?
□ Frequency of failure: every time / N% / only with specific inputs
```

## PHASE A4: AI SURGICAL FIX

```
HALLUCINATION FIX PATTERNS:
  □ Add post-generation validation (check output against known good references)
  □ Implement retrieval-augmentation (ground responses in verified source data)
  □ Add confidence scoring (reject outputs below threshold)
  □ Expand SEED_PASSAGES / SEED_GUIDANCE_MAP with correct data

PROMPT INJECTION FIX PATTERNS:
  □ Strengthen INJECTION_PATTERNS regex in safety.ts
  □ Add constitutional framing at start of each system prompt
  □ Implement input length limits + character-class restrictions on free-text fields

SAFETY BYPASS FIX PATTERNS:
  □ Wire validateSafety() to actual checkInputSafety() — remove the stub
  □ Add output safety check (not just input)
  □ Add crisis pathway test that verifies 988 referral is always present

SCOPE VIOLATION FIX PATTERNS:
  □ Expand OUT_OF_SCOPE_PATTERNS
  □ Add graceful redirect: "That's outside what I can help with, but here is a passage..."
```

## PHASE A5: AI REGRESSION SHIELD

```
□ Add test that sends the exact input that caused the failure
□ Assert the exact property of the output that was wrong
□ Add to golden test set (version-controlled)
□ Add to synthetic monitoring suite if issue was in production
```

---

# PERFORMANCE MODE

## PHASE X1: BASELINE MEASUREMENT

```
Before ANY change:
□ Measure current baseline (P50, P95, P99 latency or throughput)
□ Profile: CPU, memory, I/O, network — identify top consumer
□ Reproduce under controlled conditions
□ Establish target metric and success threshold
```

## PHASE X2: BOTTLENECK ISOLATION

```
├─ DATABASE?   → Query plans, indexes, N+1, connection pool
├─ NETWORK?    → Payload size, round trips, CDN, DNS
├─ COMPUTE?    → Algorithm complexity, blocking I/O, thread pool
├─ MEMORY?     → Allocation patterns, GC pressure, leaks
└─ CACHE?      → Hit rate, invalidation strategy, cold start
```

## PHASE X3: TARGETED OPTIMIZATION

```
Fix ONLY the proven bottleneck (same surgical rules as Phase 7B)
Measure BEFORE and AFTER every change
Accept change ONLY if it meets target metric
Reject if change degrades anything else
```

## PHASE X4: PERFORMANCE CLOSURE

```
□ Before/after benchmarks documented with commands and output
□ Performance regression test added
□ Optimization explained in comments
□ Monitoring alert set at regression threshold
```

---

## ANTI-PATTERNS THAT CREATE LOOPS

| Anti-Pattern | Translation | Correct Action |
|---|---|---|
| "Let me try this" | Guessing | Return to Phase 3 |
| "It might be..." | No evidence | Return to Phase 2 |
| "Fix both at once" | Unknown cause | One change, one test |
| "Stack trace = root cause" | Shows WHERE not WHY | Run Phase 3 fully |
| "Works on my machine" | Missing env evidence | Add env to Phase 2 |
| "I've seen this before" | Pattern without proof | Prove it this time (Phase 3C) |
| "Quick fix, investigate later" | Technical debt | Closure Phase mandatory |
| "Tests passing = fine" | Coverage gaps | Run prediction scan |

---

## DOMAIN QUICK-REFERENCE

| Domain | Phase 2 Additions | Phase 3 Focus | Key Tools |
|---|---|---|---|
| **Frontend** | Console logs, network tab, DOM snapshots, perf timeline | State mgmt, async timing, hydration | DevTools, React DevTools |
| **Backend API** | Request/response logs, middleware chain, auth tokens | Request lifecycle, serialization, error propagation | APM, structured logs |
| **Database** | Query plans, lock waits, transaction isolation | Indexes, joins, N+1, deadlock graph | EXPLAIN ANALYZE, pg_stat |
| **Mobile** | Device logs, crash reports, memory graph | Lifecycle hooks, threading, platform diff | Xcode Instruments, Perfetto |
| **Infrastructure** | System metrics, config diffs, deployment events | Resource limits, networking, IAM | Prometheus, CloudWatch |
| **AI/LLM** | System prompt, conversation turns, output samples | Hallucination, injection, drift, dead safety code | Custom test suite, deepeval |
| **Distributed** | Distributed traces, span timings, queue depths | Idempotency, ordering, partial failure | Jaeger, OpenTelemetry |
| **Security** | Auth logs, request patterns, input validation | Injection vectors, privilege escalation | OWASP ZAP, Burp Suite |

---

```
TheLampStand-MASTER-DEBUG v2.0.0
Supersedes: apex-master-debug v1.0.0, one-pass-debug (all versions)
Compatibility: Claude, GPT-4o/o1/o3, Gemini, Llama, Mistral, DeepSeek, any LLM
License: Proprietary — TheLampStand Business Systems Ltd. Edmonton, AB, Canada.
Copyright © 2026 All Rights Reserved
```
