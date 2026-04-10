import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { saveConsentState } from "@/lib/storage";

const CONSENT_KEY = "lampstand_consent_given";

export const ConsentModal = () => {
  const [open, setOpen] = useState(false);
  const [consentStorage, setConsentStorage] = useState(true);
  const [consentVoice, setConsentVoice] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem(CONSENT_KEY);
    if (!hasConsented) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    // Sync to centralized consent state store
    saveConsentState({
      localAdaptiveMemory: consentStorage,
      localJournalStorage: consentStorage,
      microphone: consentVoice,
      voiceOutput: consentVoice,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Welcome to LampStand</DialogTitle>
          <DialogDescription className="font-sans text-base mt-2">
            Before we begin, we want to be transparent about how LampStand works and ask for your permission regarding your data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent-storage"
              checked={consentStorage}
              onCheckedChange={(c) => setConsentStorage(c as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="consent-storage" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Local Storage & Adaptive Memory
              </label>
              <p className="text-sm text-muted-foreground">
                Allow LampStand to store your journal entries and conversation history locally on this device. You can clear this data at any time in Settings.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent-voice"
              checked={consentVoice}
              onCheckedChange={(c) => setConsentVoice(c as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="consent-voice" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Voice Input (Microphone)
              </label>
              <p className="text-sm text-muted-foreground">
                Allow LampStand to access your microphone for voice interaction. Audio is transcribed locally via your browser and raw audio is never stored or transmitted.
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded border">
            By continuing, you agree to our <a href="/legal/terms" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">Terms of Service</a> and acknowledge our <a href="/legal/privacy" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. Lampstand is an AI companion and does not replace professional counseling or medical advice.
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} className="w-full sm:w-auto">Accept and Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
