import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

/**
 * Detects Vite/Rollup dynamic-import chunk 404s.
 * These appear as "Failed to fetch dynamically imported module"
 * and cannot be recovered by resetting React state alone — a full
 * page reload is required to load the updated asset manifest.
 */
function isChunkLoadError(error: Error): boolean {
  const msg = error?.message ?? '';
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('Unable to preload CSS for')
  );
}

const CHUNK_RELOAD_KEY = 'lampstand_chunk_reload_at';
const CHUNK_RELOAD_COOLDOWN_MS = 10_000; // 10 s — prevent infinite reload loops

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isChunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);

    // Auto-reload once for chunk errors to pick up the new asset manifest.
    if (isChunkLoadError(error)) {
      const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? '0');
      const now = Date.now();
      if (now - lastReload > CHUNK_RELOAD_COOLDOWN_MS) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    // For chunk errors a soft React reset won't re-fetch the missing asset;
    // always do a hard reload so the browser picks up the latest index.html.
    if (this.state.isChunkError) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: null, isChunkError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const { isChunkError } = this.state;

      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div className="max-w-sm text-center space-y-4">
            <h2 className="text-xl font-serif font-semibold text-foreground">
              {isChunkError ? 'Update available' : 'Something went wrong'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isChunkError
                ? 'A newer version of the app is available. Refreshing now…'
                : 'An unexpected error occurred. Your data is safe.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isChunkError ? 'Refresh Now' : 'Try Again'}
              </button>
              {!isChunkError && (
                <button
                  onClick={() => window.location.assign('/app')}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Return Home
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
