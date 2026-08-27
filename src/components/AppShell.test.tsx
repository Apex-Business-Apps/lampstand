import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, signOut: vi.fn() }),
}));

describe('AppShell Component', () => {
  it('renders desktop side-rail navigation and mobile navigation bars', () => {
    render(
      <MemoryRouter initialEntries={['/app']}>
        <AppShell>
          <div data-testid="test-content">Sanctuary Content</div>
        </AppShell>
      </MemoryRouter>,
    );

    // Verify main child content renders
    expect(screen.getByTestId('test-content')).toBeDefined();
    expect(screen.getByText('Sanctuary Content')).toBeDefined();

    // Verify desktop side rail and mobile wordmark logo
    expect(screen.getAllByAltText('TheLampStand').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Sanctuary')).toBeDefined();
    expect(screen.getByText('Disciplines')).toBeDefined();
    expect(screen.getByText('Account')).toBeDefined();

    // Verify core navigation links render in DOM
    expect(screen.getAllByText('Daily Light').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Guidance').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Settings').length).toBeGreaterThanOrEqual(1);
  });
});
