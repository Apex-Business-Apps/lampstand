import { useState, useEffect, useCallback } from 'react';
import { isStandaloneDisplayMode } from '@/lib/pwa/standalone';

export type Platform = 'ios-safari' | 'ios-other' | 'android' | 'desktop' | 'unknown';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
  if (isIOS) {
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    return isSafari ? 'ios-safari' : 'ios-other';
  }
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

let cachedPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    cachedPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((listener) => listener(cachedPrompt));
  });

  window.addEventListener('appinstalled', () => {
    cachedPrompt = null;
    promptListeners.forEach((listener) => listener(null));
  });
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => cachedPrompt);
  const [isInstalled, setIsInstalled] = useState<boolean>(isStandaloneDisplayMode);
  const [platform, setPlatform] = useState<Platform>(detectPlatform);

  useEffect(() => {
    setIsInstalled(isStandaloneDisplayMode());
    setPlatform(detectPlatform());

    const updatePrompt = (prompt: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(prompt);
    };

    promptListeners.add(updatePrompt);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      cachedPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(cachedPrompt);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      cachedPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      promptListeners.delete(updatePrompt);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    const promptToUse = deferredPrompt || cachedPrompt;
    if (!promptToUse) return false;
    try {
      await promptToUse.prompt();
      const choice = await promptToUse.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        cachedPrompt = null;
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [deferredPrompt]);

  return {
    isInstalled,
    isInstallable: Boolean(deferredPrompt || cachedPrompt),
    platform,
    promptInstall,
  };
}
