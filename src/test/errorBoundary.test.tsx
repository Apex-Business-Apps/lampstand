import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Thrower = ({ error }: { error: Error }) => {
  throw error;
};

describe('ErrorBoundary resilient recovery invariants', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('renders generic fallback for standard runtime exceptions', () => {
    // Suppress console.error in test output
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Thrower error={new Error('Generic rendering crash')} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Your data is safe.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Return Home' })).toBeInTheDocument();
  });

  it('identifies diverse chunk and module loading errors', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const chunkErrors = [
      new Error('Failed to fetch dynamically imported module: https://thelampstand.icu/assets/HomePage-abc.js'),
      new Error('TypeError: error loading dynamically imported module'),
      new Error('TypeError: Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of text/html'),
      new Error('Unable to preload CSS for /assets/index.css'),
      new Error('ChunkLoadError: Loading chunk 45 failed.'),
      new Error('TypeError: Failed to fetch'),
    ];

    for (const err of chunkErrors) {
      const { unmount } = render(
        <ErrorBoundary>
          <Thrower error={err} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Update available')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Refresh Now' })).toBeInTheDocument();
      unmount();
    }
  });

  it('clears caches and triggers page reload when Refresh Now is clicked on chunk error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock, assign: vi.fn() },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <Thrower error={new Error('Failed to fetch dynamically imported module')} />
      </ErrorBoundary>
    );

    const refreshBtn = screen.getByRole('button', { name: 'Refresh Now' });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled();
    });
  });
});
