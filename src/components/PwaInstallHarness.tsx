import { useState } from 'react';
import { Download, Smartphone, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useNavigate } from 'react-router-dom';
import { PwaDownloadModal } from '@/components/PwaDownloadModal';

interface PwaInstallHarnessProps {
  compact?: boolean;
}

export function PwaInstallHarness({ compact = false }: PwaInstallHarnessProps) {
  const { isInstalled, isInstallable, promptInstall } = usePwaInstall();
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(true);
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

        <PwaDownloadModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
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

      <PwaDownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
