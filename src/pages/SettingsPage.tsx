import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProfile, saveProfile, getKnowledge, clearKnowledge, resetAllData, getConsentState, saveConsentState, getVoicePreferences, saveVoicePreferences, clearVoiceHistory, saveSyncState } from '@/lib/storage';
import type { UserProfile, ToneStyle, ReadingPreference } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Shield, Trash2, RotateCcw } from 'lucide-react';
import { getConsent, saveConsent, resetConsent, type ConsentState } from '@/lib/consent';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(getConsent());

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setProfile(p);
  }, [navigate]);

  if (!profile) return null;

  function update(partial: Partial<UserProfile>) {
    const updated = { ...profile!, ...partial };
    setProfile(updated);
    saveProfile(updated);
  }

  function handleResetKnowledge() {
    clearKnowledge();
    setShowReset(false);
  }

  function handleResetAll() {
    resetAllData();
    resetConsent();
    navigate('/onboarding');
  }

  async function requestNotificationsConsent(enabled: boolean) {
    if (!enabled) {
      const next = saveConsent({ notifications: false });
      setConsent(next);
      update({ notificationsEnabled: false });
      return;
    }
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    const approved = permission === 'granted';
    const next = saveConsent({ notifications: approved });
    setConsent(next);
    update({ notificationsEnabled: approved });
  }

  function toggleConsent<K extends keyof ConsentState>(key: K, value?: boolean) {
    const next = saveConsent({ [key]: value ?? !consent[key] });
    setConsent(next);
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
          <Field label="Daily Light">
            <div className="flex items-center gap-3">
              <button
                onClick={() => requestNotificationsConsent(!profile.notificationsEnabled)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  profile.notificationsEnabled ? 'border-primary bg-accent/60' : 'border-border text-muted-foreground'
                }`}
              >
                {profile.notificationsEnabled ? 'On' : 'Off'}
              </button>
              {profile.notificationsEnabled && (
                <Input type="time" value={profile.notificationTime} onChange={e => update({ notificationTime: e.target.value })} className="w-32" />
              )}
            </div>
          </Field>
        </Section>

        <Section title="Consent & Permissions">
          <Field label="Local memory storage">
            <button onClick={() => toggleConsent('localMemory')} className={`px-3 py-1.5 rounded-lg text-sm border ${consent.localMemory ? 'border-primary bg-accent/60' : 'border-border text-muted-foreground'}`}>
              {consent.localMemory ? 'Opted in' : 'Not enabled'}
            </button>
          </Field>
          <Field label="Microphone permissions">
            <button onClick={() => toggleConsent('microphone')} className={`px-3 py-1.5 rounded-lg text-sm border ${consent.microphone ? 'border-primary bg-accent/60' : 'border-border text-muted-foreground'}`}>
              {consent.microphone ? 'Allowed' : 'Not allowed'}
            </button>
            <p className="text-xs text-muted-foreground">Raw audio is never stored by default. Transcripts are local only unless cloud sync is enabled.</p>
          </Field>
          <Field label="Cloud sync">
            <button onClick={() => toggleConsent('cloudSync')} className={`px-3 py-1.5 rounded-lg text-sm border ${consent.cloudSync ? 'border-primary bg-accent/60' : 'border-border text-muted-foreground'}`}>
              {consent.cloudSync ? 'Enabled' : 'Disabled'}
            </button>
          </Field>
          <Field label="Kids mode voice">
            <button onClick={() => toggleConsent('voiceForKidsMode')} className={`px-3 py-1.5 rounded-lg text-sm border ${consent.voiceForKidsMode ? 'border-primary bg-accent/60' : 'border-border text-muted-foreground'}`}>
              {consent.voiceForKidsMode ? 'Enabled' : 'Disabled by default'}
            </button>
          </Field>
        </Section>


        <Section title="Privacy & Data">
          <button onClick={() => setShowPrivacy(!showPrivacy)} className="flex items-center gap-2 text-sm text-primary">
            <Shield className="h-4 w-4" /> Your data stays on your device
          </button>
          {showPrivacy && (
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2 animate-fade-in">
              <p className="text-xs text-muted-foreground"><strong>LampStand</strong> stores preferences and activity locally. Cloud sync is off until you enable it.</p>
              <p className="text-xs text-muted-foreground">Your adaptive knowledge (streak: {knowledge.streak}, interactions: {knowledge.interactionCount}) helps personalize your experience and never leaves your device.</p>
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-xs text-primary" onClick={() => navigate('/legal/privacy')}>
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
