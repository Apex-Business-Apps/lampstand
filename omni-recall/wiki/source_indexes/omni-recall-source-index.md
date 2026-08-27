# Omni-Recall Source Index

## Core Source Code Map

### Frontend Pages (`src/pages/`)
- `HomePage.tsx`: Main dashboard, streak status, daily light hero card, quick discipline action cards.
- `DailyLightPage.tsx`: Morning scripture reading, reflection, prayer, audio player, theme switcher.
- `GuidancePage.tsx`: Dedicated Burning Bush pastoral AI conversation surface with voice input and reflection block.
- `SermonPage.tsx`: Homiletic sermon generation and catalog with dynamic tone suffixes.
- `LectioPage.tsx`: 4-step Benedictine Lectio Divina flow.
- `ExamenPage.tsx`: 5-step Ignatian Daily Examen flow.
- `JournalPage.tsx`: Private spiritual journal with local storage encryption and export.
- `SavedPage.tsx`: Bookmarked scriptures and pastoral reflections.
- `MarketingPage.tsx`: Public landing page with candle reveal veil, wordmark header, brand anthem, and 1-click guest entry.
- `InstallPage.tsx`: PWA installation guide.
- `LegalPage.tsx`, `PrivacyPolicyPage.tsx`, `TermsPage.tsx`, `AcceptableUsePage.tsx`, `DisclaimerPage.tsx`, `CompanyPage.tsx`: Legal, privacy, and APEX entity pages.

### Agent & Runtime (`src/lib/`)
- `runtime/agentRuntime.ts`: Headless turn pipeline, circuit breaker, safety gates, and grounding validator.
- `agent/Grounding.ts`: Request guardrails, prompt templates, and zero-em-dash text sanitizer.
- `agent/Prompts.ts`: Burning Bush agent system prompts.
- `resonance/ResonanceEngine.ts`: 5-axis personalized recommendation math.
- `guidance/contextAssembler.ts`: Context window packager.
- `safety.ts`: Crisis, injection, and abuse pattern matcher.
- `voice.ts`: STT and TTS speech synthesis adapters.
- `storage.ts`: Local storage accessor methods and atomic mutations.

### Edge Worker (`src/workers/`)
- `static-spa.ts`: Cloudflare Worker static file server, CSP headers, and `/health` probe.
