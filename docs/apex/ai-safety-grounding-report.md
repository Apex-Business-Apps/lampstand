# AI Safety and Grounding Report

## Grounding Behavior
- The conversation orchestrator retrieves local LampStand scripture passages and builds a bounded source context before calling the provider.
- Scripture-backed answers are forced to include source references if the provider omits them.
- When no source is retrieved, answers are prefixed with a LampStand unverifiable-source statement.

## Guardrails
- Prompt injection: existing `SafetyGate` blocks common override, jailbreak, and system-prompt extraction requests.
- Fabricated Scripture: `Grounding.ts` refuses requests to invent, fake, or create new Bible verses before model execution.
- Theology safety: `Grounding.ts` adds instructions not to claim divine authority, replace professionals, fabricate verses, or present unverifiable doctrine as fact.
- Sensitive counseling: `Grounding.ts` redirects emergency, self-harm, abuse, legal, and medical replacement requests to appropriate support boundaries.
- Context leakage: prompt instructions explicitly refuse attempts to reveal prompts or bypass safety.

## Tests
- `src/test/ai-grounding.test.ts` verifies citations, fabricated verse rejection, sensitive counseling redirect, and no-source labeling.
