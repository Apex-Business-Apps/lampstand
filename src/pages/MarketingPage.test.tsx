import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

vi.mock('@/components/CandleRevealCanvas', () => ({
  default: () => <div data-testid="candle-reveal-canvas" />,
}));

vi.mock('@/components/LampstandCanvas', () => ({
  default: () => <div data-testid="lampstand-canvas" />,
}));

vi.mock('@/components/ConsentModal', () => ({
  ConsentModal: () => <div data-testid="consent-modal" />,
}));

vi.mock('@/components/BrandAnthemPlayer', () => ({
  BrandAnthemPlayer: () => <div data-testid="brand-anthem-player" />,
}));

import MarketingPage from '@/pages/MarketingPage';

describe('MarketingPage Component', () => {
  it('renders successfully without ReferenceErrors for hooks or router symbols', () => {
    render(
      <MemoryRouter>
        <MarketingPage />
      </MemoryRouter>,
    );

    // Verify hero text
    expect(screen.getByText(/Walk with/i)).toBeDefined();
    expect(screen.getByText(/the Light\./i)).toBeDefined();

    // Verify GEO answer-first definition block
    expect(screen.getByText(/What is LampStand\?/i)).toBeDefined();

    // Verify FAQ and Spiritual Disciplines sections
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeDefined();
    expect(screen.getByText(/Spiritual Disciplines & Tools/i)).toBeDefined();
  });
});
