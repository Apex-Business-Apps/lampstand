const MEDIA_EXT = /\.(mp4|webm|mov|avi|mkv|ogv|ogg|mp3|wav|flac|m4a)$/i;
const FILE_EXT  = /\.[a-zA-Z0-9]{1,8}$/;

// F-010 FIX: removed 'unsafe-inline' from script-src: Vite ESM production
// builds emit no inline <script> tags. 'unsafe-eval' is retained because
// Transformers.js (ai.worker.ts / whisper.worker.ts) requires it for ONNX
// model execution inside web workers. Track removal in:
// https://github.com/xenova/transformers.js/issues: when upstream drops eval,
// remove 'unsafe-eval' here too.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "connect-src 'self' https://*.supabase.co https://api.groq.com wss://*.supabase.co https://cloudflareinsights.com",
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

const CANONICAL_HOST = "thelampstand.icu";

// Hostile scanner / proxy farm subnets identified in Cloudflare reconnaissance traffic
function isHostileScannerIp(ip: string): boolean {
  return ip.startsWith("185.177.72.") || ip.startsWith("146.70.255.");
}

// Common vulnerability scanner probes targeting non-existent CMS / secrets
const EXPLOIT_PROBE_REGEX =
  /^(?:\/(?:wp-(?:admin|login|content|includes|json)|wordpress|wp|\.env|\.git|cgi-bin|phpmyadmin|xmlrpc\.php|setup\.php|pma|webdav)(?:[/._-].*)?|\/.*(?:\.php|\.sql|\.bak|\.conf|\.asp|\.aspx|\.jsp))$/i;

const STATIC_IMMUTABLE_EXT = /\.(woff2?|ttf|eot)$/i;
const STATIC_MEDIA_EXT = /\.(png|jpe?g|webp|avif|svg|ico|gif|mp3|wav|ogg|mp4|webm|m4a|wasm)$/i;

function addSecurityHeaders(headers: Headers): void {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
  headers.set("Content-Security-Policy", CSP);
}

// Deterministic edge & browser Cache-Control:
// - HTML navigations: no-store (prevents stale chunk loading across deployments)
// - Hashed Vite bundle chunks (/assets/*) & fonts: 1-year immutable
// - Service worker (/sw.js): no-cache, no-store, must-revalidate
// - PWA manifest (/manifest.json): 1-hour cache
// - Static media, icons, and discovery files: 24-hour edge cache with 7-day stale-while-revalidate
function applyCacheHeaders(headers: Headers, pathname: string, isHtml: boolean): void {
  if (isHtml) {
    headers.set("Cache-Control", "no-store");
    return;
  }
  if (pathname.startsWith("/assets/") || STATIC_IMMUTABLE_EXT.test(pathname)) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return;
  }
  if (pathname === "/sw.js") {
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return;
  }
  if (pathname === "/manifest.json") {
    headers.set("Cache-Control", "public, max-age=3600");
    return;
  }
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml" || STATIC_MEDIA_EXT.test(pathname)) {
    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    return;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Health endpoint: never touches ASSETS
    if (pathname === "/health") {
      return new Response(
        JSON.stringify({ status: "healthy", service: "lampstand-static-spa" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
            "Content-Security-Policy": CSP,
          },
        }
      );
    }

    // Canonical Host Consolidation: 301 redirect all www / pages.dev alias hostnames to canonical apex
    if (
      url.hostname !== CANONICAL_HOST &&
      (url.hostname === `www.${CANONICAL_HOST}` ||
        url.hostname.endsWith(".pages.dev") ||
        url.hostname.endsWith(`.${CANONICAL_HOST}`))
    ) {
      const targetUrl = new URL(request.url);
      targetUrl.protocol = "https:";
      targetUrl.hostname = CANONICAL_HOST;
      targetUrl.port = "";
      return Response.redirect(targetUrl.toString(), 301);
    }

    // Exploit Probe Defense: drop vulnerability scanning noise at the edge without touching ASSETS
    if (EXPLOIT_PROBE_REGEX.test(pathname)) {
      return new Response("Forbidden", {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      });
    }

    // Hostile Scanner Subnet Rejection: block known aggressive scanning operations at the edge
    const clientIp = request.headers.get("CF-Connecting-IP") ?? "";
    if (isHostileScannerIp(clientIp)) {
      return new Response("Forbidden", {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      });
    }

    // Stream media directly with security and caching headers
    if (MEDIA_EXT.test(pathname)) {
      const resp = await env.ASSETS.fetch(request);
      const headers = new Headers(resp.headers);
      addSecurityHeaders(headers);
      applyCacheHeaders(headers, pathname, false);
      return new Response(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers,
      });
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
    addSecurityHeaders(headers);
    applyCacheHeaders(headers, pathname, isHtml);
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  },
};
