const MEDIA_EXT = /\.(mp4|webm|mov|avi|mkv|ogv|ogg|mp3|wav|flac|m4a)$/i;
const FILE_EXT  = /\.[a-zA-Z0-9]{1,8}$/;

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "connect-src 'self' https://*.supabase.co https://api.groq.com wss://*.supabase.co",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
].join("; ");

// Rate Limiting: 60 nav requests / 60s per key.
// Key = JWT sub for authenticated users, CF-Connecting-IP for guests.
// Gracefully skipped when RATE_LIMITER binding is not configured.
function extractRateLimitKey(request: Request): string {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const auth = request.headers.get("Authorization") ?? "";
  if (auth.startsWith("Bearer ")) {
    try {
      const payload = JSON.parse(atob(auth.slice(7).split(".")[1]));
      if (payload.sub) return "user:" + payload.sub;
    } catch (_) { /* fall through */ }
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

// isHtml=true adds no-store so browsers never cache index.html across deploys.
// Stale index.html causes "Failed to fetch dynamically imported module" when
// chunk hashes change between builds — this is the permanent fix.
function addSecurityHeaders(headers: Headers, isHtml: boolean): void {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Content-Security-Policy", CSP);
  if (isHtml) {
    headers.set("Cache-Control", "no-store");
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Health endpoint — never touches ASSETS
    if (pathname === "/health") {
      return new Response(
        JSON.stringify({ status: "healthy", service: "lampstand-static-spa" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        }
      );
    }

    // Stream media directly without SPA logic
    if (MEDIA_EXT.test(pathname)) {
      return env.ASSETS.fetch(request);
    }

    const isNavigation =
      request.method === "GET" &&
      (request.headers.get("accept") ?? "").includes("text/html");

    // Rate limit navigation requests only
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

    // SPA fallback: try the real path first; if 404 and no file extension, serve /
    let resp = await env.ASSETS.fetch(request);
    if (isNavigation && resp.status === 404 && !FILE_EXT.test(pathname)) {
      resp = await env.ASSETS.fetch(
        new Request(new URL("/", request.url).toString(), request)
      );
    }

    // Treat response as HTML if it's a navigation request or content-type says so
    const isHtml =
      isNavigation ||
      (resp.headers.get("content-type") ?? "").includes("text/html");

    const headers = new Headers(resp.headers);
    addSecurityHeaders(headers, isHtml);
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  },
};
