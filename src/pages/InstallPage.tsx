import { useMemo } from 'react';
import { AppShell } from '@/components/AppShell';
import { Share, Plus, Smartphone, Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { isStandalone } from '@/lib/notifications/dailyReminder';

type Platform = 'ios-safari' | 'ios-other' | 'android' | 'desktop' | 'unknown';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
  if (isIOS) {
    // iOS only allows Add-to-Home-Screen from real Safari, not in-app browsers.
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    return isSafari ? 'ios-safari' : 'ios-other';
  }
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

export default function InstallPage() {
  const navigate = useNavigate();
  const platform = useMemo(detectPlatform, []);
  const installed = useMemo(isStandalone, []);

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-12 space-y-6 max-w-xl mx-auto">
        <div className="text-center space-y-2">
          <Smartphone className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-2xl font-serif font-semibold">Install LampStand</h1>
          <p className="text-sm text-muted-foreground">
            Add LampStand to your home screen so daily reminders, voice, and offline saves work like a native app.
          </p>
        </div>

        {installed ? (
          <div className="rounded-xl border border-primary/40 bg-accent/40 p-5 text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
            <p className="font-medium">LampStand is installed.</p>
            <p className="text-xs text-muted-foreground">
              You're running as a home-screen app. Daily Light reminders will fire at your chosen time.
            </p>
            <Button variant="outline" onClick={() => navigate('/settings')}>Open Settings</Button>
          </div>
        ) : platform === 'ios-safari' ? (
          <IosSafariSteps />
        ) : platform === 'ios-other' ? (
          <IosWrongBrowser />
        ) : platform === 'android' ? (
          <AndroidSteps />
        ) : (
          <DesktopSteps />
        )}

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Why install?</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            On iPhone, daily-light push reminders are only delivered to apps installed on the home screen — this is an Apple limitation, not ours. On Android & desktop, install gives you a faster launch and an icon you can find at a glance.
          </p>
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate('/settings')}>Continue without installing</Button>
        </div>
      </div>
    </AppShell>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
        {n}
      </span>
      <div className="text-sm text-foreground/90 leading-relaxed pt-0.5">{children}</div>
    </li>
  );
}

function IosSafariSteps() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-sm font-medium">On your iPhone (Safari)</p>
      <ol className="space-y-3">
        <Step n={1}>
          Tap the <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted"><Share className="h-3.5 w-3.5" /> Share</span> button at the bottom of Safari.
        </Step>
        <Step n={2}>
          Scroll down and tap <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted"><Plus className="h-3.5 w-3.5" /> Add to Home Screen</span>.
        </Step>
        <Step n={3}>Tap <strong>Add</strong> in the top-right.</Step>
        <Step n={4}>Open LampStand from your home screen and enable reminders in Settings.</Step>
      </ol>
    </div>
  );
}

function IosWrongBrowser() {
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 space-y-3">
      <p className="text-sm font-medium">Open this page in Safari first</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        iOS only allows Add-to-Home-Screen from Apple's Safari browser. You appear to be in Chrome, Firefox, or an in-app browser.
      </p>
      <ol className="space-y-2 text-sm">
        <Step n={1}>Tap the share or "..." menu in your current browser.</Step>
        <Step n={2}>Choose <strong>Open in Safari</strong>.</Step>
        <Step n={3}>Then come back to this page and follow the install steps.</Step>
      </ol>
    </div>
  );
}

function AndroidSteps() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-sm font-medium">On Android (Chrome)</p>
      <ol className="space-y-3">
        <Step n={1}>Tap the <strong>⋮</strong> menu in the top-right of Chrome.</Step>
        <Step n={2}>Tap <strong>Add to Home screen</strong> (or <strong>Install app</strong>).</Step>
        <Step n={3}>Confirm with <strong>Install</strong>.</Step>
        <Step n={4}>Open LampStand from your home screen and enable reminders in Settings.</Step>
      </ol>
    </div>
  );
}

function DesktopSteps() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-sm font-medium">On desktop (Chrome / Edge)</p>
      <ol className="space-y-3">
        <Step n={1}>Look for the install icon in the address bar (a small monitor with a down arrow).</Step>
        <Step n={2}>Click it and choose <strong>Install</strong>.</Step>
        <Step n={3}>LampStand opens in its own window with reminders enabled.</Step>
      </ol>
    </div>
  );
}
