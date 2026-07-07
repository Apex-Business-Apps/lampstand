import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ensureServiceWorker } from '@/lib/notifications/dailyReminder';

describe('ensureServiceWorker', () => {
  const originalServiceWorker = (navigator as unknown as { serviceWorker?: unknown }).serviceWorker;

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: originalServiceWorker,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it('returns null when the browser has no serviceWorker support', async () => {
    Object.defineProperty(navigator, 'serviceWorker', { value: undefined, configurable: true });
    await expect(ensureServiceWorker()).resolves.toBeNull();
  });

  it('is idempotent: reuses an existing registration instead of re-registering', async () => {
    const existing = { scope: '/' } as ServiceWorkerRegistration;
    const register = vi.fn();
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        getRegistration: vi.fn().mockResolvedValue(existing),
        register,
      },
      configurable: true,
    });

    const result = await ensureServiceWorker();
    expect(result).toBe(existing);
    expect(register).not.toHaveBeenCalled();
  });

  it('registers at the SW path with root scope when nothing is registered yet', async () => {
    const fresh = { scope: '/' } as ServiceWorkerRegistration;
    const register = vi.fn().mockResolvedValue(fresh);
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        getRegistration: vi.fn().mockResolvedValue(undefined),
        register,
      },
      configurable: true,
    });

    const result = await ensureServiceWorker();
    expect(result).toBe(fresh);
    expect(register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
  });

  it('swallows registration errors and returns null instead of throwing', async () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        getRegistration: vi.fn().mockRejectedValue(new Error('boom')),
        register: vi.fn(),
      },
      configurable: true,
    });

    await expect(ensureServiceWorker()).resolves.toBeNull();
  });
});
