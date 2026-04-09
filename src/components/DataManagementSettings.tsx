import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const DataManagementSettings = () => {
  const [consentStorage, setConsentStorage] = useState(localStorage.getItem("lampstand_consent_storage") === "true");
  const [consentVoice, setConsentVoice] = useState(localStorage.getItem("lampstand_consent_voice") === "true");

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all local data? This cannot be undone.")) {
      // Clear relevant keys, keep auth/consent
      const preserveKeys = ["supabase.auth.token", "lampstand_consent_given", "lampstand_consent_storage", "lampstand_consent_voice"];
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !preserveKeys.includes(key)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      toast.success("Local data cleared successfully.");
    }
  };

  const handleToggleStorage = (checked: boolean) => {
    setConsentStorage(checked);
    localStorage.setItem("lampstand_consent_storage", checked ? "true" : "false");
    if (!checked) {
      toast("Local storage disabled. App will not save new data locally.");
    }
  };

  const handleToggleVoice = (checked: boolean) => {
    setConsentVoice(checked);
    localStorage.setItem("lampstand_consent_voice", checked ? "true" : "false");
    if (!checked) {
      toast("Voice access disabled.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Privacy & Permissions</h3>

        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5">
            <Label>Local Storage & Memory</Label>
            <p className="text-sm text-muted-foreground">Allow saving journal entries and history locally.</p>
          </div>
          <Switch checked={consentStorage} onCheckedChange={handleToggleStorage} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Microphone Access</Label>
            <p className="text-sm text-muted-foreground">Allow voice interaction features.</p>
          </div>
          <Switch checked={consentVoice} onCheckedChange={handleToggleVoice} />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4 text-destructive">Danger Zone</h3>
        <Button variant="destructive" onClick={handleClearData}>
          Clear All Local Data
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          This will remove all saved passages, journal entries, and conversation history stored on this device.
        </p>
      </div>
    </div>
  );
};
