import { useEffect } from 'react';
import { hydrateFingerprintFromLocal } from '@/lib/resonance/ResonanceEngine';
import { armDailyReminder, ensureServiceWorker, isNotificationsSupported } from '@/lib/notifications/dailyReminder';
import { getSavedPassages, getJournalEntries, getProfile } from '@/lib/storage';

/**
 * Bootstraps the Resonance fingerprint from local data on app open and
 * arms the daily-light reminder if the user has opted in. Idempotent.
 */
export function useAppBoot() {
  useEffect(() => {
    // Hydrate Resonance from local data — runs once and is no-op after first signal.
    try {
      hydrateFingerprintFromLocal({
        saved: getSavedPassages(),
        journal: getJournalEntries(),
      });
    } catch {
      /* private mode / quota — ignore */
    }

    // Register the service worker (used both for reminders and as a future
    // surface for offline). Best-effort, never blocks render.
    if (isNotificationsSupported()) {
      ensureServiceWorker();
    }

    // Re-arm the reminder using the user's stored preference.
    const profile = getProfile();
    if (profile?.notificationsEnabled && profile.notificationTime) {
      armDailyReminder(
        { enabled: true, time: profile.notificationTime },
        { title: `${profile.firstName ? profile.firstName + ', y' : 'Y'}our Daily Light is ready` },
      );
    }
  }, []);
}
