/**
 * Shared Cloudflare Worker type definitions.
 *
 * Centralizes the `Env` binding contract so every Worker entrypoint
 * (static-spa, future API workers, etc.) uses one consistent, type-safe
 * shape. Avoids relying on `@cloudflare/workers-types` so the project stays
 * zero-dep and the existing build pipeline keeps compiling without extra
 * type packages.
 */

/** Cloudflare static-assets binding contract (subset we actually use). */
export interface AssetsBinding {
  fetch: (request: Request) => Promise<Response>;
}

/** Base Env shared by all Workers in this project. */
export interface WorkerEnv {
  ASSETS: AssetsBinding;
}

/** Convenience alias for Worker entrypoints that don't extend Env. */
export type StaticSpaEnv = WorkerEnv;