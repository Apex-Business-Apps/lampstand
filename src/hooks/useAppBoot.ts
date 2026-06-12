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
    const run = () => {
      try {
        hydrateFingerprintFromLocal({
          saved: getSavedPassages(),
          journal: getJournalEntries(),
        });
      } catch {
        /* private mode / quota - ignore */
      }

      if (isNotificationsSupported()) {
        ensureServiceWorker();
      }

      const profile = getProfile();
      if (profile?.notificationsEnabled && profile.notificationTime) {
        armDailyReminder(
          { enabled: true, time: profile.notificationTime },
          { title: `${profile.firstName ? profile.firstName + ', y' : 'Y'}our Daily Light is ready` },
        );
      }
    };

    // Yield to the browser's first paint before running boot tasks.
    // scheduler.postTask (Chrome 94+) is preferred; setTimeout(0) is the
    // universal fallback. Both defer to after the initial frame is painted.
    type WithScheduler = { scheduler?: { postTask: (fn: () => void) => void } };
    if (typeof (globalThis as WithScheduler).scheduler?.postTask === 'function') {
      (globalThis as WithScheduler).scheduler!.postTask(run);
    } else {
      const id = setTimeout(run, 0);
      return () => clearTimeout(id);
    }
  }, []);
}
