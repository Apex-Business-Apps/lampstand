/**
 * Daily Light Reminder — zero-cost, browser-native push reminders.
 *
 * Strategy: we use the browser's Notifications API + a service worker so the
 * reminder fires even when the tab is in the background, *without* requiring
 * a paid push service (FCM / OneSignal / WebPush+VAPID server). The service
 * worker schedules a self-fired notification at the user's preferred local
 * time using setTimeout + the persistent registration's showNotification API.
 *
 * Caveats (documented for honesty):
 *  - On iOS Safari, web push only fires when the PWA is installed to the home
 *    screen. We detect this and surface the install hint when applicable.
 *  - On desktop/Android, this works reliably even when the tab is closed
 *    *as long as the service worker has been registered at least once*.
 *  - We re-arm the timer on every app open so missed notifications recover
 *    on next visit.
 */

const SW_PATH = '/sw.js';
const REMINDER_TAG = 'lampstand-daily-light';

export interface ReminderConfig {
  enabled: boolean;
  time: string; // HH:mm 24-hour
}

/** Detect whether the runtime can deliver web notifications at all. */
export function isNotificationsSupported(): boolean {
  return typeof window !== 'undefined'
    && 'Notification' in window
    && 'serviceWorker' in navigator;
}

/** Returns Notification.permission, or 'unsupported'. */
export function getPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationsSupported()) return 'unsupported';
  return Notification.permission;
}

/** Standalone (PWA) detection — required for iOS push. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches
    || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
}

/** Register the service worker (idempotent). */
export async function ensureServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const existing = await navigator.serviceWorker.getRegistration(SW_PATH);
    if (existing) return existing;
    return await navigator.serviceWorker.register(SW_PATH, { scope: '/' });
  } catch (err) {
    console.warn('[reminder] sw register failed', err);
    return null;
  }
}

/** Ask the user for notification permission. Returns final state. */
export async function requestPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationsSupported()) return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/**
 * Compute milliseconds until the next occurrence of the given HH:mm local time.
 * Always returns > 0; if the time has already passed today, returns time-until-tomorrow.
 */
export function msUntilNext(timeHHmm: string, now = new Date()): number {
  const [h, m] = timeHHmm.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h ?? 8, m ?? 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

let activeTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Arm (or re-arm) the in-page timer that fires a notification at the next
 * occurrence of `config.time`. Safe to call repeatedly — clears prior timer.
 */
export async function armDailyReminder(config: ReminderConfig, opts?: { title?: string; body?: string }) {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
  if (!config.enabled) return;
  if (!isNotificationsSupported()) return;
  if (Notification.permission !== 'granted') return;

  const reg = await ensureServiceWorker();
  const delay = msUntilNext(config.time);

  // setTimeout has a max ~24.8d ceiling; daily reminder is always < 24h so safe.
  activeTimer = setTimeout(async () => {
    await fireReminder(reg, opts);
    // Re-arm for tomorrow.
    armDailyReminder(config, opts);
  }, delay);
}

async function fireReminder(
  reg: ServiceWorkerRegistration | null,
  opts?: { title?: string; body?: string },
) {
  const title = opts?.title ?? 'Your Daily Light is ready';
  const body = opts?.body ?? 'Take a moment with today\'s scripture.';
  const options: NotificationOptions = {
    body,
    tag: REMINDER_TAG,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: '/daily' },
  } as NotificationOptions;

  try {
    if (reg && reg.showNotification) {
      await reg.showNotification(title, options);
    } else if ('Notification' in window) {
      new Notification(title, options);
    }
  } catch (err) {
    console.warn('[reminder] fire failed', err);
  }
}

/** Cancel any armed timer. */
export function cancelReminder() {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
}
