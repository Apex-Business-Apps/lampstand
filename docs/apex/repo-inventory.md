# LampStand Repo Inventory

Verified on 2026-05-07 from `/workspace/lampstand`.

## Stack
- Framework: Vite React SPA verified by `vite.config.ts`, `src/main.tsx`, and `src/App.tsx`.
- Language: TypeScript verified by `tsconfig.json`, `src/**/*.ts`, and `src/**/*.tsx`.
- Package manager: npm 10.9.2 verified by `package.json` `packageManager` and `package-lock.json`.
- Runtime/deploy target: Cloudflare Workers static assets verified by `wrangler.json`, `wrangler.jsonc`, and `src/workers/static-spa.ts`.
- Build script: `npm run build` maps to `vite build` in `package.json`.
- Test script: `npm test` maps to `vitest run` in `package.json`.
- Lint script: `npm run lint` maps to `eslint .` in `package.json`.
- Typecheck script: `npm run typecheck` maps to `tsc --noEmit` in `package.json`.

## Source Structure
- App entry and routes: `src/main.tsx`, `src/App.tsx`, `src/pages/`.
- UI components: `src/components/`, `src/components/ui/`, `src/hooks/`, `src/index.css`, `src/App.css`.
- AI/chat modules: `src/lib/agent/`, `src/lib/ai/`, `src/lib/runtime/agentRuntime.ts`, `src/lib/groq.ts`.
- Scripture/content modules: `src/data/contentLibrary.ts`, `src/data/seed.ts`, `src/lib/dailyLight.ts`, `src/components/ScriptureCard.tsx`.
- Auth/session modules: `src/hooks/useAuth.tsx`, `src/contexts/AuthContext.tsx`, `src/components/AuthGuard.tsx`, `src/components/AuthProviderWrapper.tsx`, `src/integrations/supabase/client.ts`.
- Data/persistence modules: `src/lib/storage.ts`, `src/lib/supabaseSync.ts`, `src/integrations/supabase/types.ts`, `supabase/migrations/`.
- Voice modules: `src/lib/voice.ts`, `src/lib/voice/`, `src/components/VoiceInput.tsx`, `src/lib/audioAnalyzer.ts`.
- Notifications: `src/lib/notifications/dailyReminder.ts`.
- Tests: `src/test/`, `src/integrations/supabase/client.test.ts`.

## Verified Capabilities
- Bible/scripture content: verified in `src/data/contentLibrary.ts`, `src/data/seed.ts`, and `src/lib/adapters.ts` local retrieval.
- AI/chat behavior: verified in `src/lib/agent/ConversationOrchestrator.ts`, `src/lib/ai/AgentRuntime.ts`, `src/components/FloatingAgent.tsx`, and `src/components/FullscreenAgent.tsx`.
- Journaling/reflection features: verified in `src/pages/JournalPage.tsx`, `src/pages/DailyLightPage.tsx`, `src/lib/storage.ts`, and `supabase/migrations/20260409024002_cc641124-4cb0-409b-9d51-fd0093ad2b78.sql`.
- Sermon/content management: verified in `src/pages/SermonPage.tsx`, `src/data/seed.ts`, and `src/lib/adapters.ts`.
- Calendar/streak/reminder features: verified in `src/lib/storage.ts`, `src/lib/date.ts`, `src/lib/notifications/dailyReminder.ts`, and `src/pages/SettingsPage.tsx`.
- Sharing hooks: verified in `src/pages/DailyLightPage.tsx`, `src/components/ScriptureCard.tsx`, and `src/components/FullscreenAgent.tsx`.
- Offline/PWA/mobile support: verified in `src/pages/InstallPage.tsx`, `public/manifest.json`, `public/sw.js`, and `src/workers/static-spa.ts`.
- Logging/monitoring/health checks: logging and safety events verified in `src/lib/storage.ts`, `src/lib/runtime/agentRuntime.ts`, and `src/lib/agent/CircuitBreaker.ts`; health check added in `src/workers/static-spa.ts`.
- Admin/content roles: verified in `src/pages/AdminPage.tsx`, `src/hooks/useAdminRole.ts`, and `supabase/migrations/20260410034137_bfe8b5aa-a592-48f9-ae7c-20d28f64e6b5.sql`.

## Unverified Capabilities
- UNVERIFIED: referral event persistence not found in repository after inspection. No implementation assumes it exists.
- UNVERIFIED: hosted vector database or embeddings storage not found in repository after inspection. No implementation assumes it exists.
- UNVERIFIED: dedicated e2e Playwright spec directory not found in repository after inspection. Existing test tooling is Vitest.

## Existing Dependencies
Dependencies are verified only from `package.json` and `package-lock.json`. No new dependencies were added.
- Runtime dependencies include React, React Router, TanStack React Query, Supabase JS, Radix UI components, shadcn-style utilities, zod, date-fns, react-markdown, recharts, lucide-react, sonner, and related UI packages.
- Dev dependencies include Vite, TypeScript, Vitest, Testing Library, ESLint, Playwright package, Tailwind, Wrangler, and Cloudflare worker types via Wrangler dependencies.
