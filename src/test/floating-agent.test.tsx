import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { FloatingAgent } from '@/components/FloatingAgent';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('FloatingAgent', () => {
  it('starts in mini-collapsed mode by default', () => {
    render(
      <MemoryRouter initialEntries={['/app']}>
        <FloatingAgent />
      </MemoryRouter>
    );
    expect(screen.getByTitle('Open companion')).toBeInTheDocument();
  });

  it('allows full-screen agent mode on regular paths without faltering', async () => {
    render(
      <MemoryRouter initialEntries={['/app']}>
        <FloatingAgent />
      </MemoryRouter>
    );

    // Click to expand to mini-expanded
    const openBtn = screen.getByTitle('Open companion');
    fireEvent.click(openBtn);

    // Verify it expanded
    expect(screen.getByText('Companion')).toBeInTheDocument();

    // Click fullscreen
    const fullscreenBtn = screen.getByTitle('Fullscreen mode');
    fireEvent.click(fullscreenBtn);

    // It should now show the fullscreen agent, let's see if it falters (collapses immediately)
    // FullscreenAgent has minimize button
    await waitFor(() => {
      const minimizeBtn = screen.queryByRole('button', { name: 'Minimize fullscreen agent' });
      if (!minimizeBtn) {
          throw new Error('Not found: minimize button. Faltered back to collapsed mode.');
      }
      expect(minimizeBtn).toBeInTheDocument();
    });

    // Check that it's still there after a small delay (to see if it faltered)
    await new Promise(r => setTimeout(r, 100));
    const minimizeBtn = screen.queryByRole('button', { name: 'Minimize fullscreen agent' });
    expect(minimizeBtn).toBeInTheDocument();
  });
});
