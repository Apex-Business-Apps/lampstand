const MEDIA_EXT = /\.(mp4|webm|mov|avi|mkv|ogv|ogg|mp3|wav|flac|m4a)$/i;

// JS assets that were manually patched (filename hash no longer matches content).
// Force no-store so browsers never serve stale patched bundles.
const PATCHED_ASSETS = new Set([
  "/assets/index-CnTmNcSt.js",
  "/assets/AuthPage-v2fix.js",
  "/assets/EntryPage-v2fix.js",
  "/assets/LiteLandingPage-D1OLrVLZ.js",
]);

// Rate Limiting: applies to ALL users (authenticated and unauthenticated).
// Key = JWT sub (user ID) when a Bearer token is present, else CF-Connecting-IP.
// Gracefully skipped when RATE_LIMITER binding is not configured.
// To activate: add ratelimit binding in wrangler.production.toml (TOML format),
// or configure via Cloudflare dashboard (Workers -> Rate Limiting).
function extractRateLimitKey(request: Request): string {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const auth = request.headers.get("Authorization") ?? "";
  if (auth.startsWith("Bearer ")) {
    try {
      const payload = JSON.parse(atob(auth.slice(7).split(".")[1]));
      if (payload.sub) return "user:" + payload.sub;
    } catch (_) { /* fall through to IP */ }
  }
  return "ip:" + ip;
}

interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ASSETS: { fetch: typeof fetch };
  RATE_LIMITER?: RateLimiter;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (MEDIA_EXT.test(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    const isNavigation =
      request.method === "GET" &&
      (request.headers.get("accept") ?? "").includes("text/html");

    // Rate limit navigation requests only -- static assets are edge-cached anyway.
    if (isNavigation && env.RATE_LIMITER) {
      const key = extractRateLimitKey(request);
      const { success } = await env.RATE_LIMITER.limit({ key });
      if (!success) {
        return new Response(
          JSON.stringify({ error: "Too Many Requests", retryAfter: 60 }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60",
              "Cache-Control": "no-store",
            },
          }
        );
      }
    }

    const target = isNavigation
      ? new Request(new URL("/", request.url).toString(), request)
      : request;

    const resp = await env.ASSETS.fetch(target);

    const headers = new Headers(resp.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Bust browser cache for manually-patched bundles whose filename hash
    // no longer matches their content.
    if (PATCHED_ASSETS.has(url.pathname)) {
      headers.set("Cache-Control", "no-store");
    }

    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  },
};
