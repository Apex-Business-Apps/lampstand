export interface ConsentState {
  localMemory: boolean;
  notifications: boolean;
  microphone: boolean;
  cloudSync: boolean;
  voiceForKidsMode: boolean;
}

const KEY = 'lampstand_consent';

const DEFAULT_CONSENT: ConsentState = {
  localMemory: false,
  notifications: false,
  microphone: false,
  cloudSync: false,
  voiceForKidsMode: false,
};

export function getConsent(): ConsentState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONSENT;
    return { ...DEFAULT_CONSENT, ...JSON.parse(raw) as Partial<ConsentState> };
  } catch {
    return DEFAULT_CONSENT;
  }
}

export function saveConsent(next: Partial<ConsentState>): ConsentState {
  const merged = { ...getConsent(), ...next };
  localStorage.setItem(KEY, JSON.stringify(merged));
  return merged;
}

export function resetConsent(): void {
  localStorage.removeItem(KEY);
}
