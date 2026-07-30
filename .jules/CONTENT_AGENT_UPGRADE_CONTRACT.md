---
# LAMPSTAND — KNOWLEDGE BASE & AGENT QUALITY UPGRADE
## End-to-End Execution Contract · Google Jules Edition
### Version 2.0 · Owner: APEX Business Systems Ltd.

---

## ⚙️ MACHINE-READABLE HEADER

```yaml
repo: Apex-Business-Apps/lampstand
default_branch: main
package_manager: npm
ci_commands:
  - npm ci
  - npm run lint
  - npm run typecheck
  - npm run test
  - npm run build
branch_naming: feat/jules-<task-id>-<slug>
examples:
  - feat/jules-t1-crisis-escalation
  - feat/jules-t2-lectio-schema
  - feat/jules-t3-theme-taxonomy
  - feat/jules-t4-content-expansion
  - feat/jules-t5-validation
merge_strategy: sequential
  # T1 merged → T2 merged → T3 merged → T4 merged → T5
governing_docs:
  - AGENTS.md
  - MISSION.md
```

---

## 🔒 UNIVERSAL CONSTRAINTS

> These constraints are **HARD STOPS**. They apply unconditionally to every task.
> Jules must verify each one before committing any change. If a constraint cannot
> be satisfied, **HALT** and report to the project owner before proceeding.

**CONSTRAINT 1 — Mission lock**  
Do not introduce: monetization, IAP, subscriptions, advertising SDKs, paywalls,
feature gates tied to payment, or telemetry that tracks personally identifiable
information. Source of truth: `MISSION.md`. Any uncertainty → halt.

**CONSTRAINT 2 — No new dependencies without justification**  
Do not add entries to `dependencies` or `devDependencies` in `package.json` unless
the task explicitly authorizes it. If a utility is needed, check whether an existing
package in the lock file already covers it before adding anything new.

**CONSTRAINT 3 — No breaking public API changes**  
The following types are public contracts. Do not rename, remove, or change the type
of any existing field. Additions must be optional (`?`):
- `IAIAdapter`
- `GuidanceResult`
- `ScripturePassage`
- `Sermon`
- `DailyLight`
- `SafetyEvent`

**CONSTRAINT 4 — No fabricated scripture text**  
Every scripture passage added must be copied verbatim from a verifiable, licensed
source translation. Jules must not generate, paraphrase, or reconstruct scripture
text from memory. If Jules cannot verify exact text, leave a clearly marked
`// TODO: VERIFY TEXT — [BOOK CHAPTER:VERSE]` comment and proceed.

**CONSTRAINT 5 — Translation licensing**  
NABRE (© USCCB) already exists in the codebase at its current volume. Do not add
more NABRE passages without flagging for owner review. For all new passages, prefer:
- **ESV** (© Crossway — non-commercial use allowed)
- **WEB** (World English Bible — Public Domain)
- **KJV** (King James Version — Public Domain)

Add an explicit `translation` field to every new passage entry.

**CONSTRAINT 6 — Do not modify Jules workflow files**  
Do not modify `.jules/bolt.md` or `.jules/sentinel.md` as part of this contract.

**CONSTRAINT 7 — Deliverable format (every PR)**  
Every PR description must contain exactly these sections in order:
1. **What changed** — bullet list of concrete changes
2. **Why** — one-sentence justification per change
3. **Files touched** — exhaustive list with line ranges where practical
4. **Validation performed** — exact commands run and output summary
5. **Risks / limitations / follow-ups** — known issues and next steps

**CONSTRAINT 8 — Pre-work before any modification**  
Before touching any file in a task, Jules must:
1. Run `git status` — confirm a clean working tree on the correct feature branch.
2. Run `grep -r "<symbol>" src/` to confirm no existing implementation of the
   feature already exists.
3. Read all files listed under "Files to touch" in the task spec.
4. Check `omni-recall/` directory for prior decisions, per `AGENTS.md`.

---

## 📋 ARCHITECTURE REFERENCE

| Layer | File(s) | Role |
|---|---|---|
| Identity + voice contract | `src/lib/agent/Prompts.ts` | Canonical persona, tone rules, 4 guardrails |
| Guidance JSON adapter | `src/lib/groq.ts` | Groq adapter → `pastoralFraming`, `reflectionQuestions`, `prayer` |
| Personal context injection | `src/lib/guidance/contextAssembler.ts` | Consent-gated, 600-char bounded prompt block |
| Input safety gate | `src/lib/safety.ts` | Regex-based detection, circuit breaker |
| Personalization engine | `src/lib/resonance/ResonanceEngine.ts` | Decaying theme-affinity fingerprint + season inference |
| Curated content | `src/data/seed.ts`, `contentLibrary.ts`, `sermonLibrary.ts` | Static passage, DailyLight, guidance, sermon libraries |
| Types | `src/types/` | Public contracts — additive changes only |
| Unit tests | `src/test/` | Vitest |
| E2E tests | `playwright.config.ts`, `playwright-fixture.ts`, `tests/` | Playwright |

---

## CONTENT BASE AUDIT — QUANTIFIED GAPS

*(Read-only reference for Jules. Do not modify this section.)*

| Gap | Current State | Target |
|---|---|---|
| Passage inventory | ~115 unique passages | ≥250 unique passages |
| OT narrative coverage | Mostly absent | ≥15 new OT passages |
| Translation consistency | Mixed ESV + NABRE | All new: ESV / WEB / KJV |
| Daily Light rotation | ~58 unique entries | ≥180 unique entries |
| Sermon static fallbacks | 1 draft (`john-14-27`) | ≥40 drafts |
| Theme taxonomy | Freeform strings | ≥30 canonical themes + alias map |
| Crisis detection | Prompt-only (LLM) | Deterministic pre-LLM `CRISIS_PATTERNS` block |
| Reflection structure | Single-pass prose | Optional 4-movement lectio schema |

---

## EXECUTION TASKS

---

### TASK 1 — Hardcoded Crisis Escalation Layer

**Priority**: 🔴 CRITICAL — execute first, merge before starting any other task.  
**Branch**: `feat/jules-t1-crisis-escalation`  
**Depends on**: nothing (starts from `main`)  

#### Objective

Guarantee that any input containing self-harm, suicidal ideation, or abuse-disclosure
language produces a deterministic, non-LLM-dependent response with hardcoded crisis
resources. This closes the gap where the current system relies on prompt-level
LLM judgment for crisis interception — an insufficient safety guarantee for a
pastoral-care application.

#### Pre-work (mandatory)

```bash
git checkout -b feat/jules-t1-crisis-escalation
git status  # must be clean

# Locate existing safety test file:
find src/test -name "*safety*" -o -name "*Safety*"
# If found, note path. If absent, create src/test/safety.test.ts

# Read these files in full before writing any code:
#   src/lib/safety.ts
#   src/lib/agent/Prompts.ts
#   src/types/index.ts  (locate SafetyEvent type definition)
# Check for omni-recall:
ls omni-recall/ 2>/dev/null && cat omni-recall/*.md || echo "no omni-recall"
```

#### Scope — step by step

**Step 1.1 — Add `CRISIS_PATTERNS` to `src/lib/safety.ts`**

Insert the following regex array **ABOVE** the existing `INJECTION_PATTERNS` const.
Do not remove or reorder any existing pattern arrays.

```typescript
// ── Crisis patterns: deterministic pre-LLM intercept ─────────────────────────
// These run BEFORE all other checks. A match returns CRISIS_RESOURCE_RESPONSE
// unconditionally — no AI generation, no fallback passage, no retry.
const CRISIS_PATTERNS: RegExp[] = [
  // Suicidal ideation — direct
  /\b(want|thinking about|going to|planning to)\s+(kill|end|take)\s+(my|myself|my life)\b/i,
  /\b(suicid(e|al)|self[- ]harm|self[- ]inflict|hurting myself)\b/i,
  /\b(no reason to (live|go on)|don't want to (be alive|exist))\b/i,
  /\b(end it (all|tonight|now)|not worth (living|being here))\b/i,
  // Active abuse disclosure
  /\b(someone is (hurting|abusing|hitting|threatening) me)\b/i,
  /\b(being (abused|assaulted|threatened|stalked))\b/i,
  /\b(not safe (at home|right now|where i am))\b/i,
  // Immediate physical danger signal
  /\b(in danger right now|need emergency help)\b/i,
];
```

**Step 1.2 — Add `CRISIS_RESOURCE_RESPONSE` to `src/lib/safety.ts`**

Insert BELOW the existing `SAFE_FALLBACK_RESPONSE` const. Match its exact shape.

```typescript
export const CRISIS_RESOURCE_RESPONSE = {
  message: [
    "What you are carrying is real, and you do not have to carry it alone.",
    "Please reach out to one of these right now:",
    "• 988 Suicide & Crisis Lifeline (US/Canada): call or text 988",
    "• Crisis Text Line: text HOME to 741741",
    "• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/",
    "• Befrienders Worldwide: https://www.befrienders.org",
    "If you are in immediate danger, please call your local emergency services (911, 999, 000, or 112).",
  ].join(" "),
  type: "crisis" as const,
};
```

**Step 1.3 — Extend `SafetyEvent` type**

Locate the `SafetyEvent` type definition. Add `'crisis'` to its `type` field union
additively. Do not change any other field.

```typescript
// Before: type: 'injection' | 'abuse' | 'out-of-scope'
// After:  type: 'injection' | 'abuse' | 'out-of-scope' | 'crisis'
```

**Step 1.4 — Wire `CRISIS_PATTERNS` into `checkInputSafety()`**

Insert the following block at the **top** of the `checkInputSafety` function body,
immediately after any empty-string early return:

```typescript
for (const p of CRISIS_PATTERNS) {
  if (p.test(trimmed)) {
    const event: SafetyEvent = {
      id: crypto.randomUUID(),
      type: 'crisis',
      input: trimmed.slice(0, 200),
      action: 'blocked',
      timestamp: new Date().toISOString(),
    };
    logSafetyEvent(event);
    return {
      safe: false,
      type: 'crisis',
      reason: CRISIS_RESOURCE_RESPONSE.message,
    };
  }
}
```

Adapt field names to match the exact shape of the existing `checkInputSafety`
return type. Do not guess — read the function signature before writing.

**Step 1.5 — Update `Prompts.ts` Guardrail 2**

In `src/lib/agent/Prompts.ts`, locate `[GUARDRAIL 2]`. Append one sentence to the
CONTINGENCY line only:

> "Note: crisis-phrase inputs are intercepted before reaching this agent by a
> deterministic safety layer that provides hardcoded crisis resources directly."

Do not remove or weaken any existing Guardrail 2 language.

#### Test plan

Add to the safety test file identified in pre-work. Every test must be named exactly
as shown:

```typescript
// TRUE POSITIVES — must trigger CRISIS_RESOURCE_RESPONSE
test('crisis: direct suicidal statement')        // input: "I want to kill myself"
test('crisis: suicidal ideation indirect')       // input: "I don't want to be alive anymore"
test('crisis: abuse disclosure')                 // input: "Someone is hurting me at home"
test('crisis: immediate danger')                 // input: "I am not safe right now"

// REGRESSION GUARD — must NOT trigger CRISIS_RESPONSE (lament is valid app content)
test('no-crisis: lament psalm language')         // input: "My soul is in anguish"
test('no-crisis: grief expression')              // input: "I feel like I am dying inside"
test('no-crisis: spiritual darkness')            // input: "I feel far from God and empty"
test('no-crisis: anger at God')                  // input: "I am so angry at God right now"

// BYPASS CONFIRMATION — LLM adapter must not be called on crisis input
test('crisis: LLM adapter is never called on crisis input')
// Mock the Groq adapter. Confirm its methods receive zero calls when a crisis
// phrase is submitted through the full safety-check pipeline.
```

#### Sign-off requirements

- [ ] `npm run lint` — exit 0
- [ ] `npm run typecheck` — exit 0
- [ ] `npm run test` — all existing + all new crisis tests pass
- [ ] `npm run build` — exit 0
- [ ] Manual: type `"I want to end my life"` in guidance input → confirm
  `CRISIS_RESOURCE_RESPONSE` renders, no AI response shown
- [ ] PR description follows CONSTRAINT 7 format exactly

---

### TASK 2 — Lectio Divina Structural Schema

**Priority**: 🟠 HIGH  
**Branch**: `feat/jules-t2-lectio-schema`  
**Depends on**: Task 1 merged to `main`  
**Merge gate**: do NOT start until Task 1 PR is merged.

#### Objective

Add an optional four-movement lectio divina structure to `GuidanceResult` and
`DailyLight` types, enabling deeper reflection content without breaking any
existing consumer of those types.

| Movement | Field name | Type | Content |
|---|---|---|---|
| Meditate | `meditatioPrompt?` | `string` | One sentence to hold in silence |
| Respond | `oratioInvitation?` | `string` | One invitation to personal prayer/response |
| Rest | `contemplatioNote?` | `string` | One brief cue to release and be still |

*(The first movement — Read — maps to existing `pastoralFraming` / `reflection` fields.)*

#### Pre-work (mandatory)

```bash
git checkout main && git pull
git checkout -b feat/jules-t2-lectio-schema
git status  # must be clean

# Read these files in full:
#   src/types/index.ts
#   src/lib/groq.ts
#   src/lib/agent/Prompts.ts

# Find all consumers of GuidanceResult and DailyLight:
grep -r "GuidanceResult" src/ --include="*.ts" --include="*.tsx" -l
grep -r "DailyLight" src/ --include="*.ts" --include="*.tsx" -l
# Read every file listed in output above.
```

#### Scope — step by step

**Step 2.1 — Extend types**

Add three optional fields to `GuidanceResult` and (if `reflection` field exists)
to `DailyLight`. These fields are optional at the type level — existing code that
omits them must compile and run without change.

```typescript
meditatioPrompt?: string;  // A sentence to hold in silence
oratioInvitation?: string; // An invitation to personal response
contemplatioNote?: string; // A cue to rest in stillness
```

**Step 2.2 — Update `GroqAIAdapter` in `src/lib/groq.ts`**

In the guidance/daily prompt instruction block, append after item 5 (prayer):

```
6. (Optional) meditatioPrompt: one quiet sentence the reader can hold for 30 seconds.
7. (Optional) oratioInvitation: one brief personal prayer or honest-response invitation.
8. (Optional) contemplatioNote: one short cue to release thought and rest silently.
These three are never required. Omit if they would not genuinely serve the person.
```

In the JSON parse block, add defensive reads:

```typescript
meditatioPrompt: typeof p.meditatioPrompt === 'string' ? p.meditatioPrompt : undefined,
oratioInvitation: typeof p.oratioInvitation === 'string' ? p.oratioInvitation : undefined,
contemplatioNote: typeof p.contemplatioNote === 'string' ? p.contemplatioNote : undefined,
```

**Step 2.3 — Update UI component(s)**

Using the grep output from pre-work, find the component(s) rendering `GuidanceResult`
content. Below the existing prayer/reflection render, add conditional renders:

```tsx
{result.meditatioPrompt && (
  <p className="text-sm italic text-muted-foreground mt-3">
    {result.meditatioPrompt}
  </p>
)}
{result.oratioInvitation && (
  <p className="text-sm text-foreground mt-2">
    {result.oratioInvitation}
  </p>
)}
{result.contemplatioNote && (
  <p className="text-xs text-muted-foreground mt-2 italic">
    {result.contemplatioNote}
  </p>
)}
```

Adapt class names to match exactly what is already in use in the component.
Do not introduce new Tailwind classes not already present in the file or
`tailwind.config.ts`. Do not change the layout of existing content.

**Step 2.4 — Do NOT modify `LocalAIAdapter`**

The local fallback returns static content. The new fields will be `undefined` in
fallback responses — which is correct behavior given they are optional. No change
is needed here.

#### Test plan

```typescript
test('GuidanceResult without lectio fields is valid and renders correctly')
// Construct GuidanceResult without the three new fields.
// Assert TypeScript accepts it. Assert UI renders without error.

test('GuidanceResult with all lectio fields renders all three')
// Construct with all three fields populated.
// Assert each value appears in rendered output.

test('GroqAIAdapter JSON parse is defensive against missing lectio fields')
// Simulate a Groq response JSON omitting all three new fields.
// Assert parsed result has undefined for each field. Assert no throw.
```

#### Sign-off requirements

- [ ] `npm run lint` — exit 0
- [ ] `npm run typecheck` — exit 0, zero `any`-widening
- [ ] `npm run test` — all passing
- [ ] `npm run build` — exit 0
- [ ] Visual check: existing guidance card renders identically when new fields absent
- [ ] Visual check: new fields render below prayer when populated
- [ ] PR description follows CONSTRAINT 7 format

---

### TASK 3 — Canonical Theme Taxonomy for Resonance Matching

**Priority**: 🟠 HIGH  
**Branch**: `feat/jules-t3-theme-taxonomy`  
**Depends on**: Task 2 merged to `main`  
**Merge gate**: do NOT start until Task 2 PR is merged.

#### Objective

Replace freeform theme strings with a canonical, alias-mapped taxonomy to improve
`ResonanceEngine.ts` personalization quality — without altering its ranking math
or discarding stored user data.

#### Pre-work (mandatory)

```bash
git checkout main && git pull
git checkout -b feat/jules-t3-theme-taxonomy
git status  # must be clean

# Enumerate all existing theme strings:
grep -oP "theme: '\\K[^']+" src/data/seed.ts src/data/contentLibrary.ts | sort | uniq

# Read these files in full:
#   src/lib/resonance/ResonanceEngine.ts
#   src/data/seed.ts
#   src/data/contentLibrary.ts
#   src/data/sermonLibrary.ts
# Check omni-recall:
ls omni-recall/ 2>/dev/null && cat omni-recall/*.md || echo "no omni-recall"
```

#### Scope — step by step

**Step 3.1 — Create `src/lib/resonance/themeTaxonomy.ts`**

```typescript
export const CANONICAL_THEMES = [
  'anxiety', 'anger', 'burnout', 'caregiving', 'celebration',
  'courage', 'doubt', 'faith-deconstruction', 'fear', 'financial-stress',
  'forgiveness', 'grace', 'gratitude', 'grief', 'guidance', 'health-illness',
  'hope', 'identity', 'isolation', 'joy', 'justice', 'light', 'mercy',
  'moral-injury', 'parenting', 'patience', 'peace', 'perseverance', 'presence',
  'purpose', 'renewal', 'rest', 'shame', 'shelter', 'spiritual-dryness',
  'steadfastness', 'temptation', 'transformation', 'transition', 'trust',
  'uncertainty', 'wisdom',
] as const;

export type CanonicalTheme = typeof CANONICAL_THEMES[number];

export const THEME_ALIASES: Record<string, CanonicalTheme> = {
  'loneliness':      'isolation',
  'lonely':          'isolation',
  'alone':           'isolation',
  'worry':           'anxiety',
  'anxious':         'anxiety',
  'tired':           'burnout',
  'exhaustion':      'burnout',
  'weary':           'burnout',
  'sick':            'health-illness',
  'illness':         'health-illness',
  'suffering':       'grief',
  'loss':            'grief',
  'mourning':        'grief',
  'help':            'guidance',
  'direction':       'guidance',
  'identity-crisis': 'identity',
  'purpose-loss':    'purpose',
  'waiting':         'uncertainty',
  'discernment':     'uncertainty',
  'shame-guilt':     'shame',
  'guilt':           'shame',
  'compassion':      'mercy',
  'kindness':        'mercy',
  'strength':        'courage',
  'confidence':      'trust',
  'remembrance':     'renewal',
  'returning':       'renewal',
  'deconstruction':  'faith-deconstruction',
  'justice-seeking': 'justice',
};

/**
 * Normalize a freeform theme string to a canonical key.
 * Returns the canonical match if found, or the original string
 * (lowercased, trimmed) if no mapping exists — preserving unknown
 * themes rather than silently discarding them.
 */
export function normalizeTheme(input: string): string {
  const lower = input.trim().toLowerCase();
  const aliased = THEME_ALIASES[lower];
  if (aliased) return aliased;
  if ((CANONICAL_THEMES as readonly string[]).includes(lower)) return lower;
  return lower; // unknown: pass through, do not discard
}
```

**Step 3.2 — Add localStorage migration shim to `ResonanceEngine.ts`**

Import `normalizeTheme` at the top of `ResonanceEngine.ts`:

```typescript
import { normalizeTheme } from './themeTaxonomy';
```

In `loadFingerprint()`, **after** the parsed fingerprint object is obtained and
**before** it is returned, add:

```typescript
// T3 migration: normalize stored themeAffinity keys to canonical form
if (fp.themeAffinity) {
  const normalized: Record<string, number> = {};
  for (const [key, weight] of Object.entries(fp.themeAffinity)) {
    const canon = normalizeTheme(key);
    normalized[canon] = (normalized[canon] ?? 0) + (weight as number);
  }
  fp.themeAffinity = normalized;
}
```

Do NOT modify `rankCandidates`, `recordSignal`, `inferSeason`, `saveFingerprint`,
or `decayFingerprint` — only `loadFingerprint`.

**Step 3.3 — Create codemod script `scripts/normalize-themes.ts`**

This script must:
1. Import `normalizeTheme` from `../src/lib/resonance/themeTaxonomy`.
2. Read `src/data/seed.ts`, `src/data/contentLibrary.ts`, `src/data/sermonLibrary.ts`
   as strings.
3. Replace every occurrence of `theme: '<value>'` with `theme: '<normalized>'`.
4. Write files back in-place.
5. Print a diff summary (original → replacement) for every substitution.
6. Exit with code 1 if any replacement fails validation.

Run: `npx ts-node scripts/normalize-themes.ts`

Jules must run this script, review the printed diff, then commit the resulting
file changes as part of this task's PR.

**Step 3.4 — Retrofit `recordSignal()` call sites**

For every call site that passes a `theme:` string to `recordSignal()`, wrap
the value with `normalizeTheme()`:

```typescript
// Before: recordSignal({ theme: 'loneliness', ... })
// After:  recordSignal({ theme: normalizeTheme('loneliness'), ... })
```

Import `normalizeTheme` at each call-site file that needs it.

#### Test plan

```typescript
test('normalizeTheme: canonical key returns unchanged')         // 'anxiety' → 'anxiety'
test('normalizeTheme: alias resolves correctly')               // 'loneliness' → 'isolation'
test('normalizeTheme: unknown string passes through lowercased') // 'custom-theme' → 'custom-theme'
test('normalizeTheme: whitespace and case-insensitive')        // '  Grief  ' → 'grief'

test('loadFingerprint: pre-migration keys are normalized on load')
// Seed localStorage: { themeAffinity: { loneliness: 0.8, worry: 0.6 } }
// Call loadFingerprint()
// Assert result.themeAffinity === { isolation: 0.8, anxiety: 0.6 }

test('loadFingerprint: migration merges duplicate canonical keys')
// Seed: { themeAffinity: { loneliness: 0.4, isolation: 0.5 } }
// Assert result.themeAffinity.isolation === 0.9
```

#### Sign-off requirements

- [ ] `npm run lint` — exit 0
- [ ] `npm run typecheck` — exit 0
- [ ] `npm run test` — all passing including migration tests
- [ ] `npm run build` — exit 0
- [ ] Codemod diff output included in PR description
- [ ] Before/after sample: one `themeAffinity` localStorage object showing correct normalization
- [ ] PR description follows CONSTRAINT 7 format

---

### TASK 4 — Curated Content Expansion

**Priority**: 🟠 HIGH  
**Branch**: `feat/jules-t4-content-expansion`  
**Depends on**: Task 3 merged to `main`  
**Merge gate**: do NOT start until Task 3 PR is merged.

#### Objective

Expand the static knowledge base to close quantified gaps in passage coverage,
Daily Light rotation, and sermon fallback depth — using verified scripture text
only, with full translation attribution and canonical theme tagging.

#### Pre-work (mandatory)

```bash
git checkout main && git pull
git checkout -b feat/jules-t4-content-expansion
git status  # must be clean

# Establish exact baselines (not estimates):
grep -c "reference:" src/data/seed.ts
grep -c "reference:" src/data/contentLibrary.ts
grep -c "theme:" src/data/contentLibrary.ts
grep -c "^  '" src/data/sermonLibrary.ts

# Collect all existing IDs to avoid collision:
grep -oP "id: '\\K[^']+" src/data/seed.ts src/data/contentLibrary.ts | sort > /tmp/existing_ids.txt

# Read canonical theme list:
# src/lib/resonance/themeTaxonomy.ts (CANONICAL_THEMES from Task 3)
```

#### HARD REQUIREMENT — scripture text sourcing

Every passage `text` field must be copied verbatim from one of:
- **ESV** — esv.org (non-commercial use allowed)
- **WEB** — worldenglishbible.org (Public Domain)
- **KJV** — Public Domain

Do NOT use NABRE for new entries. Do NOT generate scripture text from memory.
If Jules cannot confirm exact text for a specific verse, insert:
```typescript
text: '// TODO: VERIFY TEXT — [BOOK CHAPTER:VERSE]',
translation: 'ESV', // pending verification
```
and continue to the next entry.

#### Step 4.1 — Expand `src/data/seed.ts` — Scripture Passages

Add new `ScripturePassage` entries to reach a combined total of **≥250 unique
passages** across `seed.ts` + `contentLibrary.ts`.

Required coverage — minimum 5 new entries from each category:

| Category | Books to draw from |
|---|---|
| OT narrative | Genesis, Exodus, Joshua, Ruth, 1–2 Samuel, 1–2 Kings |
| Wisdom literature | Job, Proverbs, Song of Songs, Ecclesiastes |
| Minor prophets | Hosea, Micah, Habakkuk, Zephaniah, Zechariah |
| NT epistles (underrepresented) | James, 1–2 Peter, 1–3 John, Jude |
| NT narrative | Acts (narrative sections only, not speeches) |

Required entry shape:
```typescript
{
  id: '<book-abbrev>-<chapter>-<verseStart>',  // e.g., 'gen-1-1'
  book: '<Full Book Name>',
  chapter: <number>,
  verseStart: <number>,
  verseEnd: <number>,
  text: '"<exact text from licensed source>"',
  translation: 'ESV' | 'WEB' | 'KJV',
  reference: '<Book Chapter:Verse>',
}
```

#### Step 4.2 — Expand `src/data/contentLibrary.ts` — Daily Light entries

Add `DailyLight` entries to reach **≥180 unique themed daily entries**.

Every new entry must:
- Use a canonical theme from `CANONICAL_THEMES` (Task 3)
- Reference a real passage in `seed.ts` or `contentLibrary.ts`
- Include a `reflection` of 2–3 sentences written in the voice contract from
  `Prompts.ts`: intimate, direct, no filler phrases, no em-dashes, no
  motivational-poster register, no performance of piety
- Include a `prayer` of 25–35 words, speaking directly to God, not summarizing
  or performing for an audience

Theme distribution: every canonical theme must have **≥3 Daily Light entries**.

#### Step 4.3 — Expand `src/data/sermonLibrary.ts` — Sermon drafts

Add `SermonDraft` entries to reach **≥40 static drafts**.

Work through the following passage list in order. Cover as many as possible,
starting from the top:

```
'gen-1-1-3'    // Genesis 1:1-3  — creation / identity
'gen-32-24-28' // Genesis 32:24-28 — wrestling / moral-injury
'exod-14-14'   // Exodus 14:14 — trust / fear
'ruth-1-16-17' // Ruth 1:16-17 — loyalty / grief
'job-38-1-7'   // Job 38:1-7 — wilderness / suffering
'ps-22-1-3'    // Psalm 22:1-3 — spiritual-dryness / lament
'ps-23'        // Psalm 23 — peace / presence / trust
'ps-51-10-12'  // Psalm 51:10-12 — shame / renewal
'ps-139-1-4'   // Psalm 139:1-4 — identity / presence
'isa-40-28-31' // Isaiah 40:28-31 — burnout / renewal
'isa-55-8-9'   // Isaiah 55:8-9 — uncertainty / trust
'jer-29-11'    // Jeremiah 29:11 — hope / purpose
'lam-3-22-23'  // Lamentations 3:22-23 — steadfastness / grief
'mic-6-8'      // Micah 6:8 — justice / purpose
'hab-3-17-18'  // Habakkuk 3:17-18 — perseverance / trust
'matt-5-3-10'  // Matthew 5:3-10 — identity
'matt-6-25-27' // Matthew 6:25-27 — anxiety / trust
'matt-11-28-30'// Matthew 11:28-30 — rest / burnout
'mark-4-35-41' // Mark 4:35-41 — fear / trust
'luke-15-20-24'// Luke 15:20-24 — grace / renewal
'luke-24-13-16'// Luke 24:13-16 — grief / presence
'john-1-5'     // John 1:5 — light / hope
'john-8-36'    // John 8:36 — forgiveness / freedom
'john-11-35'   // John 11:35 — grief / presence
'john-15-4-5'  // John 15:4-5 — purpose / identity
'acts-2-42-47' // Acts 2:42-47 — community / perseverance
'rom-8-18'     // Romans 8:18 — suffering / hope
'rom-8-38-39'  // Romans 8:38-39 — identity / grace
'1cor-13-4-7'  // 1 Corinthians 13:4-7 — love / relational conflict
'2cor-4-8-9'   // 2 Corinthians 4:8-9 — perseverance / courage
'2cor-5-17'    // 2 Corinthians 5:17 — transformation / renewal
'gal-5-22-23'  // Galatians 5:22-23 — identity / joy
'eph-2-8-9'    // Ephesians 2:8-9 — grace / shame
'phil-4-6-7'   // Philippians 4:6-7 — anxiety / peace
'col-1-17'     // Colossians 1:17 — trust / presence
'jas-1-2-4'    // James 1:2-4 — perseverance / suffering
'1pet-5-7'     // 1 Peter 5:7 — anxiety / trust
'1john-4-18'   // 1 John 4:18 — fear / courage
'rev-21-4'     // Revelation 21:4 — grief / hope / renewal
'heb-11-1'     // Hebrews 11:1 — faith / uncertainty
```

Every new sermon draft must follow the existing `SermonDraft` shape:
```typescript
'<passage-id>': {
  title: '<Precise, evocative title — not generic>',
  reflection: `<200–280 word pastoral reflection.>
// Voice contract: name the living heartbeat of the passage, unpack its
// original context briefly, connect to one specific contemporary human situation,
// close with a sentence that opens rather than closes. No em-dashes. No filler.
// No motivational-poster register. Follow existing john-14-27 draft as model.`,
  relevance: `<2–3 sentences connecting passage to a specific, concrete
// contemporary situation — not 'everyday struggles' but something precise.
// e.g., 'This matters when a parent learns their adult child is in crisis
// and they cannot fix it. The helplessness that comes with loving someone
// through something beyond your control is exactly what this passage names.'`,
  prayer: `<30–50 word heartfelt prayer. Personal and direct to God.
// Not a summary. Not a performance. A real request.>`,
}
```

#### Step 4.4 — Run content lint

Create `scripts/content-lint.ts`:

```typescript
// This script must:
// 1. Collect all passage IDs from seed.ts + contentLibrary.ts
// 2. Assert no duplicate IDs (exit 1 on violation)
// 3. Assert every passage: id, book, chapter, verseStart, text, translation, reference all non-empty
// 4. Assert every DailyLight: passage ref exists, theme is in CANONICAL_THEMES, reflection, prayer non-empty
// 5. Assert every canonical theme has >=3 DailyLight entries
// 6. Print a coverage table: canonical theme -> count
// 7. Print passage totals: seed.ts count, contentLibrary.ts count, combined total
// 8. Exit 0 only if all assertions pass
```

Run: `npx ts-node scripts/content-lint.ts`  
Include **complete console output** in the PR description.

#### Sign-off requirements

- [ ] `npm run lint` — exit 0
- [ ] `npm run typecheck` — exit 0
- [ ] `npm run test` — all passing
- [ ] `npm run build` — exit 0
- [ ] `npx ts-node scripts/content-lint.ts` — exit 0, zero violations
- [ ] Coverage table in PR showing every canonical theme ≥3 entries
- [ ] Passage count before/after in PR (e.g., "115 → 268 passages")
- [ ] 5 passages spot-checked against source translation by Jules; findings noted in PR
- [ ] PR description follows CONSTRAINT 7 format

---

### TASK 5 — Integration Validation & Production Sign-Off

**Priority**: 🟢 STANDARD  
**Branch**: `feat/jules-t5-validation`  
**Depends on**: Tasks 1–4 ALL merged to `main`  
**Merge gate**: do NOT start until all four preceding PRs are merged.

#### Objective

Prove all four upgrades integrate non-destructively in a production-equivalent
environment, with evidence sufficient for owner sign-off before production deployment.

#### Pre-work (mandatory)

```bash
git checkout main && git pull
git checkout -b feat/jules-t5-validation
git status  # must be clean

# Confirm all task branches are merged (should be absent):
git branch --all | grep feat/jules-t
# Expected: no output (all merged and deleted)

# Read README.md — locate staging deployment command.
```

#### Scope — step by step

**Step 5.1 — Full CI suite**

```bash
npm ci
npm run lint        # record exit code
npm run typecheck   # record exit code
npm run test        # record exit code
npm run build       # record exit code
```

All must exit 0. Record each command's summary output for the PR.

**Step 5.2 — Playwright E2E suite**

```bash
npx playwright test --config=playwright.config.ts
```

The following flows must be covered (add tests if not present):
- `[P1]` Guidance flow: pastoral concern submitted → AI response renders with
  `pastoralFraming`; lectio fields present or gracefully absent
- `[P2]` Crisis flow: crisis phrase → `CRISIS_RESOURCE_RESPONSE` renders, no Groq call
- `[P3]` Daily Light: page loads → entry renders with theme, reflection, prayer
- `[P4]` Sermon: passage with static draft → sermon draft renders correctly

Attach the Playwright HTML report as a PR artifact.

**Step 5.3 — Manual QA checklist**

Record PASS or FAIL for each check in the PR:

| ID | Input / Action | Expected Result |
|---|---|---|
| M1 | Type `"I want to end my life"` in guidance input | `CRISIS_RESOURCE_RESPONSE` renders; no AI response |
| M2 | Type `"My soul is in anguish"` in guidance input | Normal AI guidance response |
| M3 | Submit any pastoral concern | `pastoralFraming` present; lectio fields present OR absent gracefully |
| M4 | Navigate to Daily Light | Entry renders with theme, reflection, prayer |
| M5 | Select passage from Task 4 sermon list | Sermon draft renders correctly |
| M6 | Toggle consent off in settings | Context assembler returns null; no personal data injected |
| M7 | Submit 5 rapid abuse-pattern attempts | Circuit breaker activates |
| M8 | Submit 3 `grief`-related concerns | `themeAffinity.grief` > 0 in localStorage |

**Step 5.4 — Staging deployment**

```bash
npm run build
npx wrangler deploy --config wrangler.json
```

Smoke-test the staging URL against M1–M4. Record the staging URL in the PR.

**DO NOT** deploy to production (`wrangler.production.toml`) without explicit
owner authorization. Staging deployment is the sign-off gate.

#### Sign-off requirements

- [ ] Full CI suite: all four commands exit 0, output included in PR
- [ ] Playwright HTML report artifact attached
- [ ] Manual QA table: all 8 checks marked PASS
- [ ] Staging URL recorded in PR
- [ ] PR description follows CONSTRAINT 7 format
- [ ] Staging sign-off confirmed by project owner before production deployment

---

## 📊 CONTRACT SUMMARY TABLE

| Task | Branch | Primary Files | Risk | Blast Radius | Depends On | Mission Check |
|---|---|---|---|---|---|---|
| T1: Crisis escalation | `feat/jules-t1-crisis-escalation` | `safety.ts`, `Prompts.ts`, `types/` | 🔴 Critical | Safety path only | None | Privacy-safe, no PII |
| T2: Lectio schema | `feat/jules-t2-lectio-schema` | `types/`, `groq.ts`, `Prompts.ts`, UI | 🟡 Medium | Additive types only | T1 merged | No paywall/gating |
| T3: Theme taxonomy | `feat/jules-t3-theme-taxonomy` | `resonance/`, new `themeTaxonomy.ts` | 🟡 Medium | localStorage migration | T2 merged | Local-first, no telemetry |
| T4: Content expansion | `feat/jules-t4-content-expansion` | `seed.ts`, `contentLibrary.ts`, `sermonLibrary.ts` | 🟢 Low | Append-only | T3 merged | Licensed translations only |
| T5: Validation | `feat/jules-t5-validation` | Read-only + CI | 🟢 Low | N/A | T1–T4 merged | Confirms all constraints |

---

*End of contract. Total tasks: 5. Total PRs: 5. Merge order: T1 → T2 → T3 → T4 → T5.*  
*All work governed by `AGENTS.md` and `MISSION.md`. No exceptions.*
