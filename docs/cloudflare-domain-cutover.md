# Cloudflare Domain Cutover (thelampstand.icu)

This repository deploys as a Cloudflare Worker with static assets.
Use Worker custom-domain routes for production domain binding.

## Required Cloudflare API token scope

Create a token with all of the following:

- Account -> Cloudflare Pages -> Edit (only needed if cleaning up old Pages project)
- Account -> Workers Scripts -> Edit
- Zone -> Zone -> Read
- Zone -> DNS -> Edit
- Zone -> SSL and Certificates -> Edit
- Zone -> Zone Settings -> Edit

Token resources must include the zone for:

- thelampstand.icu

## Required GitHub repository secrets

- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

## Deploy path

1. Verify there are no conflicting A/AAAA/CNAME records for `thelampstand.icu` and `www`.
2. Run the `Deploy Worker Production` workflow or deploy locally:
   - `npm ci`
   - `npm run build`
   - `npx wrangler deploy --config wrangler.production.json`
3. Confirm custom domain routes are active in Worker settings.
4. Verify TLS mode at zone level is `Full (strict)` after origin route is healthy.
5. Validate endpoint:
   - `https://thelampstand.icu`
   - `https://www.thelampstand.icu`

## Rollback

- Re-deploy prior commit on `main` using `wrangler.json`.
- Re-point DNS records to previous stable target if route conflict occurs.
