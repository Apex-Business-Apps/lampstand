import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProfile, saveProfile, getKnowledge, clearKnowledge, resetAllData, getConsentState, saveConsentState, getVoicePreferences, saveVoicePreferences, clearVoiceHistory, saveSyncState } from '@/lib/storage';
import type { UserProfile, ToneStyle, ReadingPreference } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Shield, Trash2, RotateCcw, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  armDailyReminder,
  cancelReminder,
  getPermission,
  isNotificationsSupported,
  requestPermission,
} from '@/lib/notifications/dailyReminder';
import { describeFingerprint, resetFingerprint } from '@/lib/resonance/ResonanceEngine';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [consent, setConsent] = useState(getConsentState());
  const [voicePrefs, setVoicePrefs] = useState(getVoicePreferences());

  useEffect(() => {
    if (authLoading) return;

    const p = getProfile();
    if (!p) { navigate('/onboarding', { replace: true }); return; }
    setProfile(p);
  }, [authLoading, navigate, user]);

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function update(partial: Partial<UserProfile>) {
    const updated = { ...profile!, ...partial };
    setProfile(updated);
    saveProfile(updated);
  }

  async function handleToggleNotifications(next: boolean) {
    if (next) {
      if (!isNotificationsSupported()) {
        toast({
          title: 'Notifications not supported',
          description: 'This browser does not support web notifications.',
          variant: 'destructive',
        });
        return;
      }
      const result = await requestPermission();
      if (result !== 'granted') {
        toast({
          title: 'Permission needed',
          description: 'Enable notifications in your browser to receive Daily Light reminders.',
          variant: 'destructive',
        });
        return;
      }
      update({ notificationsEnabled: true });
      await armDailyReminder(
        { enabled: true, time: profile?.notificationTime || '08:00' },
        { title: `${profile?.firstName ? profile.firstName + ', y' : 'Y'}our Daily Light is ready` },
      );
      toast({
        title: 'Reminder set',
        description: `You will get a gentle nudge at ${profile?.notificationTime || '08:00'} each day.`,
      });
    } else {
      update({ notificationsEnabled: false });
      cancelReminder();
    }
  }

  async function handleTimeChange(time: string) {
    update({ notificationTime: time });
    if (profile?.notificationsEnabled && getPermission() === 'granted') {
      await armDailyReminder(
        { enabled: true, time },
        { title: `${profile?.firstName ? profile.firstName + ', y' : 'Y'}our Daily Light is ready` },
      );
    }
  }

  function handleResetKnowledge() {
    clearKnowledge();
    resetFingerprint();
    setShowReset(false);
    toast({ title: 'Adaptive memory cleared' });
  }

  function handleResetAll() {
    resetAllData();
    resetFingerprint();
    cancelReminder();
    navigate('/onboarding');
  }

  const knowledge = getKnowledge();

  const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            value === o.value ? 'border-primary bg-accent/60 text-foreground' : 'border-border text-muted-foreground hover:border-primary/40'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-8">
        <h1 className="text-2xl font-serif font-semibold">Settings</h1>

        <Section title="Profile">
          <Field label="First Name">
            <Input value={profile.firstName} onChange={e => update({ firstName: e.target.value })} maxLength={50} />
          </Field>
        </Section>

        <Section title="Preferences">
          <Field label="Tone Style">
            <Select
              value={profile.toneStyle}
              onChange={v => update({ toneStyle: v as ToneStyle })}
              options={[
                { value: 'gentle', label: 'Gentle' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'traditional', label: 'Traditional' },
              ]}
            />
          </Field>
          <Field label="Reading Style">
            <Select
              value={profile.readingPreference}
              onChange={v => update({ readingPreference: v as ReadingPreference })}
              options={[
                { value: 'modern', label: 'Modern' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'traditional', label: 'Traditional' },
              ]}
            />
          </Field>
          <Field label="Kids Mode">
            <button
              onClick={() => update({ kidsMode: !profile.kidsMode })}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                profile.kidsMode ? 'border-primary bg-accent/60' : 'border-border text-muted-foreground'
              }`}
            >
              {profile.kidsMode ? 'Enabled' : 'Disabled'}
            </button>
          </Field>
        </Section>

        <Section title="Notifications">
          <Field label="Daily Light reminder">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleToggleNotifications(!profile.notificationsEnabled)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  profile.notificationsEnabled ? 'border-primary bg-accent/60' : 'border-border text-muted-foreground'
                }`}
              >
                {profile.notificationsEnabled ? 'On' : 'Off'}
              </button>
              {profile.notificationsEnabled && (
                <Input type="time" value={profile.notificationTime} onChange={e => handleTimeChange(e.target.value)} className="w-32" />
              )}
            </div>
            {profile.notificationsEnabled && getPermission() === 'denied' && (
              <p className="text-xs text-destructive mt-2">
                Browser notifications are blocked. Re-enable them in your site settings to receive reminders.
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              A gentle nudge at your chosen time. Delivered locally — no third-party push service.
            </p>
          </Field>
        </Section>

        <Section title="Resonance">
          <ResonanceCard />
        </Section>



        <Section title="Consent & Permissions">
          <ConsentToggle label="Local adaptive memory" value={consent.localAdaptiveMemory} onChange={(v) => { const next = { ...consent, localAdaptiveMemory: v }; setConsent(next); saveConsentState({ localAdaptiveMemory: v }); }} />
          <ConsentToggle label="Local journal storage" value={consent.localJournalStorage} onChange={(v) => { const next = { ...consent, localJournalStorage: v }; setConsent(next); saveConsentState({ localJournalStorage: v }); }} />
          <ConsentToggle label="Optional cloud sync" value={consent.optionalCloudSync} onChange={(v) => { const next = { ...consent, optionalCloudSync: v, accountLinkedPersistence: v }; setConsent(next); saveConsentState({ optionalCloudSync: v, accountLinkedPersistence: v }); saveSyncState({ enabled: v, provider: v ? 'supabase' : 'none' }); }} />
          <ConsentToggle label="Notifications" value={consent.notifications} onChange={(v) => { const next = { ...consent, notifications: v }; setConsent(next); saveConsentState({ notifications: v }); }} />
          <ConsentToggle label="Microphone" value={consent.microphone} onChange={(v) => { const next = { ...consent, microphone: v }; setConsent(next); saveConsentState({ microphone: v }); }} />
          <ConsentToggle label="Voice output" value={consent.voiceOutput} onChange={(v) => { const next = { ...consent, voiceOutput: v }; setConsent(next); saveConsentState({ voiceOutput: v }); const voice = { ...voicePrefs, enabled: v ? true : false, muted: v ? voicePrefs.muted : true }; setVoicePrefs(voice); saveVoicePreferences(voice); }} />

          <Field label="Voice behavior">
            <div className="space-y-2">
              <ConsentToggle label="Enable voice playback" value={voicePrefs.enabled} onChange={(v) => { const next = { ...voicePrefs, enabled: v }; setVoicePrefs(next); saveVoicePreferences({ enabled: v }); }} />
              <ConsentToggle label="Mute voice" value={voicePrefs.muted} onChange={(v) => { const next = { ...voicePrefs, muted: v }; setVoicePrefs(next); saveVoicePreferences({ muted: v }); }} />
              <ConsentToggle label="Allow voice in kids mode" value={voicePrefs.allowKidsModeVoice} onChange={(v) => { const next = { ...voicePrefs, allowKidsModeVoice: v }; setVoicePrefs(next); saveVoicePreferences({ allowKidsModeVoice: v }); }} />
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Speech speed ({voicePrefs.speed.toFixed(1)}x)</label>
                <input type="range" min={0.75} max={1.25} step={0.05} value={voicePrefs.speed} onChange={(e) => { const speed = Number(e.target.value); const next = { ...voicePrefs, speed }; setVoicePrefs(next); saveVoicePreferences({ speed }); }} className="w-full" />
              </div>
            </div>
          </Field>

          <Button variant="outline" size="sm" className="w-full" onClick={clearVoiceHistory}>Delete Voice Transcript History</Button>
        </Section>

        <Section title="Privacy & Data">
          <button onClick={() => setShowPrivacy(!showPrivacy)} className="flex items-center gap-2 text-sm text-primary">
            <Shield className="h-4 w-4" /> Your data stays on your device
          </button>
          {showPrivacy && (
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2 animate-fade-in">
              <p className="text-xs text-muted-foreground">
                <strong>LampStand</strong> stores all your preferences, saved passages, journal entries, and learning data locally on your device. Nothing is shared, uploaded, or used to train any model by default.
              </p>
              <p className="text-xs text-muted-foreground">Your adaptive knowledge (streak: {knowledge.streak}, interactions: {knowledge.interactionCount}) helps personalize your experience and never leaves your device.</p>
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-xs text-primary" onClick={() => navigate('/legal')}>
                  View full Legal & Privacy documentation
                </Button>
              </div>
            </div>
          )}
<div className="space-y-3 pt-2">
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setShowReset(!showReset)}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset Learning Data
            </Button>
            {showReset && (
              <div className="bg-accent/40 rounded-lg p-4 space-y-3 animate-fade-in">
                <p className="text-xs text-muted-foreground">This clears your adaptive knowledge (preferences, streak, interaction history). Your saved passages and journal entries will be preserved.</p>
                <Button variant="outline" size="sm" onClick={handleResetKnowledge}>Confirm Reset</Button>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleResetAll}>
              <Trash2 className="h-3.5 w-3.5" /> Reset Everything & Start Over
            </Button>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-serif font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}


function ConsentToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
      <span className="text-sm">{label}</span>
      <button onClick={() => onChange(!value)} className={`px-3 py-1 rounded-md text-xs border ${value ? 'border-primary bg-accent/60' : 'border-border text-muted-foreground'}`}>
        {value ? 'Opted in' : 'Opted out'}
      </button>
    </div>
  );
}

function ResonanceCard() {
  const fp = describeFingerprint();
  const seasonLabel: Record<string, string> = {
    wilderness: 'Wilderness — God meeting you in hard places',
    waiting: 'Waiting — held in the in-between',
    steady: 'Steady — ordinary fidelity',
    flourishing: 'Flourishing — joy and gratitude rising',
    returning: 'Returning — finding the way back',
  };
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">Your spiritual fingerprint</p>
          <p className="text-xs text-muted-foreground">
            On-device personalization. Stays with you. Learns what resonates as your seasons shift.
          </p>
        </div>
      </div>
      <div className="grid gap-2 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Current season</span><span className="font-medium">{seasonLabel[fp.season] ?? fp.season}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Confidence</span><span className="font-medium">{Math.round(fp.confidence * 100)}%</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Signals captured</span><span className="font-medium">{fp.signalCount}</span></div>
        {fp.topThemes.length > 0 && (
          <div className="flex justify-between gap-2"><span className="text-muted-foreground">Resonating themes</span><span className="font-medium text-right truncate">{fp.topThemes.join(', ')}</span></div>
        )}
      </div>
    </div>
  );
}

