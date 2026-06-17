import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// vi.mock calls are hoisted before imports, so these mocks are active
// before AuthPage and its dependencies are evaluated.

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOtp: vi.fn(),
    },
  },
  supabasePublishableKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test',
}));

vi.mock('@/components/AgentPresence', () => ({
  AgentPresence: () => <div data-testid="agent-presence" />,
}));

// vi.hoisted ensures the mock fn exists before vi.mock factories run
const { mockIsSupabaseConfigured } = vi.hoisted(() => ({
  mockIsSupabaseConfigured: vi.fn(),
}));

vi.mock('@/integrations/supabase/config', () => ({
  isSupabaseConfigured: mockIsSupabaseConfigured,
  getSupabaseConfig: vi.fn(() => ({
    url: 'https://example.supabase.co',
    publishableKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test',
  })),
}));

import AuthPage from '@/pages/AuthPage';

function renderAuthPage() {
  return render(
    <MemoryRouter>
      <AuthPage />
    </MemoryRouter>,
  );
}

describe('AuthPage — configuration error state', () => {
  beforeEach(() => {
    mockIsSupabaseConfigured.mockReset();
  });

  it('shows a configuration error when Supabase is not configured', () => {
    mockIsSupabaseConfigured.mockReturnValue(false);
    renderAuthPage();

    expect(screen.getByText('Configuration Error')).toBeInTheDocument();
    expect(screen.getByText(/Authentication is unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/VITE_SUPABASE_PUBLISHABLE_KEY/i)).toBeInTheDocument();
  });

  it('does not show the auth form when Supabase is not configured', () => {
    mockIsSupabaseConfigured.mockReturnValue(false);
    renderAuthPage();

    expect(screen.queryByPlaceholderText('Email address')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument();
  });

  it('shows the auth form when Supabase is configured', () => {
    mockIsSupabaseConfigured.mockReturnValue(true);
    renderAuthPage();

    expect(screen.queryByText('Configuration Error')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
  });
});
