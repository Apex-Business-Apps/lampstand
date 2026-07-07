/**
 * Single source of truth for "is this an installed PWA" detection.
 *
 * This gates critical routing (EntryPage, ProfileGuard) and install-state UI
 * (InstallPage, dailyReminder). Do not re-implement locally — three separate
 * copies of this check previously existed and could drift out of sync,
 * silently breaking the installed-app routing rule. Import from here instead.
 */
export function isStandaloneDisplayMode(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaMatch = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mediaMatch || iosStandalone;
}
