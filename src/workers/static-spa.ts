/// <reference types="@cloudflare/workers-types" />

export interface Env {
  ASSETS: Fetcher;
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), geolocation=(), payment=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://storage.googleapis.com",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://api.groq.com",
    "media-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function isHtmlNavigation(request: Request) {
  const accept = request.headers.get('accept') || '';
  return request.method === 'GET' && accept.includes('text/html');
}

function hasFileExtension(pathname: string) {
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return withSecurityHeaders(assetResponse);

    const url = new URL(request.url);
    if (!isHtmlNavigation(request) || hasFileExtension(url.pathname)) {
      return withSecurityHeaders(assetResponse);
    }

    const fallback = new Request(new URL('/index.html', request.url), request);
    return withSecurityHeaders(await env.ASSETS.fetch(fallback));
  },
};
