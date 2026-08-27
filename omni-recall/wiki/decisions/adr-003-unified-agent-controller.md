# ADR-003: Single Unified State Machine for Agent Surfaces

## Status: Accepted

## Context
Multiple UI surfaces (`FloatingAgent`, `FullscreenAgent`, `GuidancePage`) interact with the Burning Bush pastoral agent, previously risking state desynchronization.

## Decision
All surfaces must consume `useAgentController()` as the single source of truth for listening, speech, thinking, error, context, and safety states.

## Consequences
Eliminates duplicate audio playback bugs and guarantees uniform safety handling.
