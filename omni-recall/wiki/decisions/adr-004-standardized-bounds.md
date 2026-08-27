# ADR-004: Standardized Input and Context Bounds

## Status: Accepted

## Context
Conflicting constant definitions across modules previously caused inconsistent text truncation and token consumption.

## Decision
Enforce exact repository-wide limits:
- `MAX_AI_INPUT_CHARS = 1200` in `Grounding.ts`
- `MAX_CONTEXT_CHARS = 600` in `contextAssembler.ts`
- `topK = 5` in `agentRuntime.ts` and `adapters.ts`

## Consequences
Protects edge token limits and prevents prompt-flooding attacks.
