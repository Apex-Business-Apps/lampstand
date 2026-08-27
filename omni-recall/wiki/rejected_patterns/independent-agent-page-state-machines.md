# Rejected Pattern: Independent Agent Page State Machines

## Why Rejected
Maintaining local `useState` in individual pages (e.g. `isListening`, `isSpeaking`, `replay`) desynchronizes voice controls, introduces double-speech bugs, and breaks global agent presence.

## Alternative
All UI surfaces must strictly consume `useAgentController()`.
