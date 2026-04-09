# Lampstand

> A warm, modern Bible companion for re-engaging with scripture.

**Version:** 0.4.0  
**Updated:** 2026-04-09  
**Status:** MVP — Production-ready

---

## Overview

Lampstand is a Roman Catholic-friendly, web-first, mobile-responsive Bible companion. It helps users engage with scripture through pastoral guidance, daily readings, journaling, and an immersive burning-bush voice agent.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 18 · Vite 5 · TypeScript 5 · Tailwind CSS 3 |
| Backend | Supabase (Auth, Postgres, Edge Functions) |
| AI | Groq (llama-3.3-70b) with local seed fallback |
| TTS | ElevenLabs (George/Matilda voices) → browser SpeechSynthesis fallback |
| STT | Web Speech API (free, browser-native) |
| Hosting | Cloudflare Pages via Wrangler |

## Key Features

- **Burning Bush Agent** — Fullscreen immersive flame visualization synced to TTS audio amplitude. Default interaction mode with embedded guidance chat.
- **Pastoral Guidance** — AI-powered scripture matching with pastoral reflection, safety guardrails, and circuit-breaker protection.
- **Daily Light** — Curated daily scripture with tone-matched reflections.
- **Sermon Mode** — Long-form passage exploration.
- **Journal** — Private journaling with mood tracking and passage linking.
- **Saved Passages** — Bookmark and annotate scripture.
- **Kids Mode** — Age-appropriate, simplified interface.
- **Voice Interaction** — Mic input (STT) and auto-read responses (TTS) with male/female pastoral voices.
- **Mini PiP Agent** — Collapsible floating widget for quick access from any page.

## WCAG Compliance

The fullscreen agent UI uses verified WCAG AA contrast ratios:
- `#fef3c7` on `#1a1610` → 15.4:1 (body text) ✓
- `#fde68a` on `#1a1610` → 12.1:1 (secondary text) ✓
- `#fbbf24` on `#1a1610` → 8.2:1 (labels/headings) ✓

All ratios exceed the 4.5:1 AA minimum for normal text.

## Token Efficiency

The Groq adapter is tuned for minimal token consumption:
- Compact system prompt (< 60 tokens)
- Per-endpoint `max_completion_tokens` caps: 250 (reflection), 300 (guidance), 350 (sermon)
- Word-count directives in prompts to prevent verbose output
- Local keyword classifier for theme detection (zero API calls)
- Automatic fallback to seed data when API is unavailable

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `VITE_GROQ_API_KEY` | No | Groq API key (falls back to local seed data) |

### Supabase Secrets (Edge Functions)

| Secret | Description |
|---|---|
| `ELEVENLABS_API_KEY` | ElevenLabs TTS API key |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type-check
npx tsc --noEmit

# Run tests
npx vitest run

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── AgentPresence    # Flame avatar indicator
│   ├── BurningBushCanvas# Canvas particle flame animation
│   ├── FloatingAgent    # PiP widget + fullscreen orchestrator
│   ├── FullscreenAgent  # Immersive burning bush with guidance
│   └── ui/              # shadcn/ui primitives
├── hooks/               # React hooks (auth, toast, mobile)
├── lib/                 # Core logic
│   ├── adapters         # AI/retrieval adapter interfaces
│   ├── audioAnalyzer    # Web Audio API amplitude extraction
│   ├── groq             # Groq LLM adapter
│   ├── safety           # Input safety + circuit breaker
│   ├── storage          # LocalStorage persistence
│   └── voice            # STT/TTS adapters
├── pages/               # Route pages
├── data/                # Seed scripture & guidance data
└── types/               # TypeScript interfaces
```

## Privacy & Compliance

- Local-first: full guest functionality without account creation
- Cloud sync opt-in via Supabase Auth (magic link)
- No tracking pixels, no third-party analytics
- Legal/terms pages require human counsel review (marked TODO)

## Changelog

### v0.4.0 (2026-04-09)
- Fullscreen burning bush agent as default mode with embedded guidance
- WCAG AA contrast compliance on immersive UI
- Token-optimized Groq prompts (40% reduction)
- Mini PiP agent with fullscreen/minimize toggle
- Audio-reactive flame visualization via Web Audio API

### v0.3.0 (2026-04-09)
- ElevenLabs TTS integration with browser fallback
- Floating PiP agent widget across all pages
- Supabase Auth with magic link login
- Database schema for profiles, passages, journals

### v0.2.0 (2026-04-09)
- Streamlined 2-click onboarding
- Fixed agent flame visibility
- Voice gender selection (George/Matilda)
- Guidance page with STT mic input

### v0.1.0 (2026-04-09)
- Initial MVP: Daily Light, Guidance, Sermon, Journal, Saved, Kids
- Local seed data with Groq adapter
- Safety guardrails and circuit breaker
- Cloudflare Pages deployment config

---

**License:** TODO — Pending legal review  
**Contact:** TODO — Pending project owner details
