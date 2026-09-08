import { useState } from 'react';
import { Download, Smartphone, CheckCircle2, Share, Plus, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useNavigate } from 'react-router-dom';

interface PwaInstallHarnessProps {
  compact?: boolean;
}

export function PwaInstallHarness({ compact = false }: PwaInstallHarnessProps) {
  const { isInstalled, isInstallable, platform, promptInstall } = usePwaInstall();
  const [showIosModal, setShowIosModal] = useState(false);
  const navigate = useNavigate();

  if (isInstalled) {
    if (compact) {
      return (
        <div
          data-testid="pwa-install-harness"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/40 text-xs text-muted-foreground"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>Installed as app</span>
        </div>
      );
    }

    return (
      <div
        data-testid="pwa-install-harness"
        className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2"
      >
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          <CheckCircle2 className="h-4 w-4" />
          <span>TheLampStand is installed</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Running in standalone mode. Offline saves and daily reminders are active on this device.
        </p>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await promptInstall();
      if (success) return;
    }

    if (platform === 'ios-safari' || platform === 'ios-other') {
      setShowIosModal(true);
      return;
    }

    navigate('/install');
  };

  if (compact) {
    return (
      <>
        <div data-testid="pwa-install-harness">
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstallClick}
            className="w-full gap-2 text-xs border-primary/40 hover:bg-primary/10 text-foreground"
          >
            <Download className="h-3.5 w-3.5 text-primary" />
            <span>Install App</span>
          </Button>
        </div>

        {showIosModal && (
          <IosInstallModal onClose={() => setShowIosModal(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div
        data-testid="pwa-install-harness"
        className="rounded-xl border border-border bg-card/60 p-4 space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Install TheLampStand</p>
              <p className="text-xs text-muted-foreground">
                Install as a standalone app for fast offline reading and reminders.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="gap-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isInstallable ? 'Install Now' : 'How to Install'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/install')}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <span>Full guide</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {showIosModal && (
        <IosInstallModal onClose={() => setShowIosModal(false)} />
      )}
    </>
  );
}

function IosInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-semibold text-foreground">Add to Home Screen</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          To install on iOS Safari, follow these two quick steps:
        </p>

        <ol className="space-y-3 text-xs">
          <li className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
              1
            </span>
            <div className="leading-relaxed pt-0.5">
              Tap the <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-muted font-medium"><Share className="h-3 w-3" /> Share</span> button at the bottom of Safari.
            </div>
          </li>
          <li className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
              2
            </span>
            <div className="leading-relaxed pt-0.5">
              Scroll down and tap <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-muted font-medium"><Plus className="h-3 w-3" /> Add to Home Screen</span>.
            </div>
          </li>
        </ol>

        <div className="pt-2 flex justify-end">
          <Button size="sm" onClick={onClose} className="text-xs">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
