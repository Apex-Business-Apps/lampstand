/// <reference types="@cloudflare/workers-types" />

export interface Env {
  ASSETS: Fetcher;
}

function isHtmlNavigation(request: Request) {
  const accept = request.headers.get('accept') || '';
  return request.method === 'GET' && accept.includes('text/html');
}

function hasFileExtension(pathname: string) {
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return assetResponse;

    const url = new URL(request.url);
    if (!isHtmlNavigation(request) || hasFileExtension(url.pathname)) {
      return assetResponse;
    }

    const fallback = new Request(new URL('/index.html', request.url), request);
    return env.ASSETS.fetch(fallback);
  },
};
