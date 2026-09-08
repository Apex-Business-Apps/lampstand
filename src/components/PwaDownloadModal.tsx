import { useState } from 'react';
import { Download, Smartphone, Share, Plus, ExternalLink, X, Monitor, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useNavigate } from 'react-router-dom';

interface PwaDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaDownloadModal({ isOpen, onClose }: PwaDownloadModalProps) {
  const { isInstalled, isInstallable, platform, promptInstall } = usePwaInstall();
  const [installing, setInstalling] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handlePrompt = async () => {
    setInstalling(true);
    try {
      const accepted = await promptInstall();
      if (accepted) {
        onClose();
      }
    } finally {
      setInstalling(false);
    }
  };

  const handleFullGuide = () => {
    onClose();
    navigate('/install');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-modal-title"
      className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-[#D97736]/30 bg-[#121212] p-6 text-foreground shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D97736]/15 text-[#F2A649]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 id="pwa-modal-title" className="text-lg font-serif font-semibold text-white">
                Install TheLampStand
              </h3>
              <p className="text-xs text-[#a0a0a0]">
                Native standalone companion with offline scripture access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isInstalled ? (
          <div className="rounded-xl border border-[#D97736]/40 bg-[#D97736]/10 p-4 text-center space-y-2">
            <CheckCircle2 className="h-7 w-7 text-[#F2A649] mx-auto" />
            <p className="text-sm font-semibold text-white">Already Installed</p>
            <p className="text-xs text-[#b0b0b0] leading-relaxed">
              TheLampStand is installed on this device. You can launch it directly from your home screen or apps.
            </p>
          </div>
        ) : (
          <>
            {isInstallable && (
              <div className="rounded-xl border border-[#D97736]/40 bg-gradient-to-br from-[#D97736]/20 to-[#F2A649]/10 p-4 text-center space-y-3">
                <p className="text-sm font-medium text-white">One-Click Install Ready</p>
                <p className="text-xs text-[#c0c0c0]">
                  Your browser supports direct installation. Click below to add TheLampStand immediately.
                </p>
                <Button
                  onClick={handlePrompt}
                  disabled={installing}
                  className="w-full h-11 border-none bg-[#D97736] hover:bg-[#c2682d] text-white font-semibold text-sm shadow-md gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>{installing ? 'Installing...' : 'Install to Device'}</span>
                </Button>
              </div>
            )}

            {platform === 'ios-safari' && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#F2A649]">
                  iOS Safari Instructions
                </p>
                <ol className="space-y-2.5 text-xs text-[#d0d0d0]">
                  <li className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#D97736] text-white text-[10px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="pt-0.5 leading-relaxed">
                      Tap the <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 font-medium text-white"><Share className="h-3 w-3" /> Share</span> button at the bottom of Safari.
                    </span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#D97736] text-white text-[10px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="pt-0.5 leading-relaxed">
                      Scroll down and tap <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 font-medium text-white"><Plus className="h-3 w-3" /> Add to Home Screen</span>.
                    </span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#D97736] text-white text-[10px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <span className="pt-0.5 leading-relaxed">
                      Tap <strong className="text-white">Add</strong> in the top right to complete.
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {platform === 'ios-other' && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs text-[#d0d0d0]">
                <p className="font-semibold text-[#F2A649]">Open in Safari to Install</p>
                <p className="leading-relaxed">
                  iOS requires Apple Safari to install home screen apps. Open this URL in Safari and tap Share followed by Add to Home Screen.
                </p>
              </div>
            )}

            {(platform === 'desktop' || platform === 'unknown') && !isInstallable && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F2A649]">
                  <Monitor className="h-4 w-4" />
                  <span>Desktop Chrome or Edge</span>
                </div>
                <ol className="space-y-2 text-xs text-[#d0d0d0]">
                  <li className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#D97736] text-white text-[10px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="pt-0.5 leading-relaxed">
                      Look for the <strong className="text-white">Install</strong> icon on the right side of the address bar above.
                    </span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#D97736] text-white text-[10px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="pt-0.5 leading-relaxed">
                      Click it and choose <strong className="text-white">Install</strong> to run TheLampStand in a dedicated window.
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {platform === 'android' && !isInstallable && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#F2A649]">
                  Android Chrome Instructions
                </p>
                <ol className="space-y-2 text-xs text-[#d0d0d0]">
                  <li className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#D97736] text-white text-[10px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="pt-0.5 leading-relaxed">
                      Tap the menu (<strong className="text-white">⋮</strong>) in the top-right of Chrome.
                    </span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#D97736] text-white text-[10px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="pt-0.5 leading-relaxed">
                      Tap <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home screen</strong>.
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullGuide}
            className="text-xs text-[#a0a0a0] hover:text-white gap-1.5 p-0 hover:bg-transparent"
          >
            <span>View Full Guide</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="text-xs border-white/20 text-white hover:bg-white/10"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
