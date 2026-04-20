import { describe, it, expect, vi, beforeEach } from 'vitest';
import { msUntilNext, isNotificationsSupported, getPermission } from '@/lib/notifications/dailyReminder';

describe('dailyReminder', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('msUntilNext returns time until later today when target is in the future', () => {
    const now = new Date('2026-04-20T05:00:00');
    const ms = msUntilNext('08:00', now);
    expect(ms).toBe(3 * 60 * 60 * 1000); // 3 hours
  });

  it('msUntilNext rolls over to tomorrow when target already passed', () => {
    const now = new Date('2026-04-20T09:00:00');
    const ms = msUntilNext('08:00', now);
    // 23 hours away.
    expect(ms).toBe(23 * 60 * 60 * 1000);
  });

  it('msUntilNext is always positive', () => {
    const now = new Date();
    const [hh, mm] = [now.getHours(), now.getMinutes()];
    const ms = msUntilNext(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, now);
    // Even when the target equals "now" we roll forward a day.
    expect(ms).toBeGreaterThan(0);
  });

  it('isNotificationsSupported returns boolean', () => {
    expect(typeof isNotificationsSupported()).toBe('boolean');
  });

  it('getPermission returns a known value or unsupported', () => {
    const v = getPermission();
    expect(['granted', 'denied', 'default', 'unsupported']).toContain(v);
  });
});
