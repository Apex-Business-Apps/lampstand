# Architecture Node: Resonance Personalization Engine

## File Location
`src/lib/resonance/ResonanceEngine.ts`

## 5 Continuous Personalization Axes

1. **Theme Affinity**: Tracks exponential moving frequency of themes engaged across guidance, reflection, and journal.
2. **Spiritual Season**: Classifies user journey into continuous archetypes:
   - `seeking`
   - `wrestling`
   - `consolation`
   - `desert`
   - `celebration`
   - `steady`
3. **Novelty Bonus**: Prevents repetitive scripture presentation by rewarding unvisited canonical passages.
4. **Pastoral Care Sentiment**: Biases scoring toward comfort and reassurance during distressed or sorrowful emotional sentiment.
5. **Topic Continuity**: `calculateTopicContinuity()` provides smooth continuity across multi-turn reflections without rigid topic lock-in.

All math runs 100% on-device in pure TypeScript with zero external server calls.
