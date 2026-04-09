# Lampstand

Lampstand is an AI-powered spiritual companion designed to provide pastoral guidance and biblical reflections. It uses a private, local-first architecture coupled with an explicit, modular agent harness that connects to providers such as Groq.

## Architecture Overview

Lampstand is a Vite + React + TypeScript Single Page Application. It uses Supabase for authentication and a robust Provider Adapter pattern for AI logic:

* **Auth**: Supabase Magic Link and Email/Password flow. Guest Mode works purely locally.
* **Storage**: LocalStorage first, gated by explicit user consent (`lib/storage.ts`).
* **AI Adapter**: A swappable AI adapter (`lib/ai/GroqAdapter.ts`, `lib/ai/NullAdapter.ts`), heavily constrained by system prompts (`lib/ai/AgentRuntime.ts`) to avoid AI "filler" (no em dashes, no robotic validation).

## Environment Setup

Create a \`.env\` file with the following variables:

\`\`\`env
# Optional. Required for AI functionality.
VITE_GROQ_API_KEY=your_groq_api_key

# Required for Authentication
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Cloudflare Deployment

Lampstand is deployed as a static-asset Cloudflare Worker.

1. Ensure Wrangler is installed: \`npm i -D wrangler\`
2. Build the app: \`npm run build\`
3. Deploy to Cloudflare Pages/Workers: \`npm run deploy\` (which runs \`wrangler pages deploy dist\`)

Configuration is found in \`wrangler.jsonc\`.

## Privacy and Consent

Lampstand defaults to a **Privacy-First Posture**:
- By default, data is NOT sent to the cloud, except strictly for LLM generation (when Groq is configured) or Authentication (when Supabase is used).
- Raw voice audio is NEVER stored. Audio is transcribed via browser APIs where permitted.
- The user is confronted with a Consent Modal on first-run. If they do not consent to Local Storage, no user state (outside of auth tokens) is written to disk.

## Legal and Compliance

Pages for Privacy Policy, Terms of Service, Acceptable Use, and an AI Disclaimer have been added.

**TODO**: All legal surfaces and disclaimers are draft content and require review by legal counsel. They clearly articulate limited licenses to end users, disclaim professional mental health care liability, and enforce APEX Business Systems LTD. ownership.

## Local Development

\`\`\`bash
npm install
npm run dev &
\`\`\`

## Testing

Run tests with Vitest:
\`\`\`bash
npm test
\`\`\`
