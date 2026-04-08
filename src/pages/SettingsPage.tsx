import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProfile, saveProfile, getKnowledge, clearKnowledge, resetAllData, getConsentSettings, saveConsentSettings } from '@/lib/storage';
import type { UserProfile, ToneStyle, ReadingPreference, ConsentSettings } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Trash2, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [consent, setConsent] = useState<ConsentSettings>(getConsentSettings());

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setProfile(p);
  }, [navigate]);

  if (!profile) return null;

  function update(partial: Partial<UserProfile>) {
    const updated = { ...profile, ...partial };
    setProfile(updated);
    saveProfile(updated);
  }

  async function toggleNotifications() {
    if (!consent.notifications && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
    }
    const next = { ...consent, notifications: !consent.notifications };
    setConsent(next);
    saveConsentSettings(next);
  }

  function toggleConsent<K extends keyof ConsentSettings>(key: K) {
    const next = { ...consent, [key]: !consent[key] };
    setConsent(next);
    saveConsentSettings(next);
  }

  return (
    <AppShell>
      <div className="px-4 pt-8 pb-6 space-y-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-semibold">Settings</h1>

        <Section title="Account">
          <p className="text-sm text-muted-foreground">{session?.user?.email ? `Signed in as ${session.user.email}` : 'Guest mode is active.'}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/auth')}>Manage sign in</Button>
            {session && <Button variant="outline" onClick={signOut}>Sign out</Button>}
          </div>
        </Section>

        <Section title="Profile">
          <Field label="First name">
            <Input value={profile.firstName} onChange={(e) => update({ firstName: e.target.value })} maxLength={50} />
          </Field>
          <Field label="Tone style">
            <Select value={profile.toneStyle} onChange={(v) => update({ toneStyle: v as ToneStyle })} options={[{ value: 'gentle', label: 'Gentle' }, { value: 'balanced', label: 'Balanced' }, { value: 'traditional', label: 'Traditional' }]} />
          </Field>
          <Field label="Reading style">
            <Select value={profile.readingPreference} onChange={(v) => update({ readingPreference: v as ReadingPreference })} options={[{ value: 'modern', label: 'Modern' }, { value: 'balanced', label: 'Balanced' }, { value: 'traditional', label: 'Traditional' }]} />
          </Field>
        </Section>

        <Section title="Consent and permissions">
          <ConsentRow label="Store local memory" value={consent.localMemory} onToggle={() => toggleConsent('localMemory')} hint="Controls local journaling and personalization storage." />
          <ConsentRow label="Notifications" value={consent.notifications} onToggle={toggleNotifications} hint="Asks browser permission before enabling." />
          <ConsentRow label="Microphone" value={consent.microphone} onToggle={() => toggleConsent('microphone')} hint="Required for voice input." />
          <ConsentRow label="Voice playback" value={consent.voicePlayback} onToggle={() => toggleConsent('voicePlayback')} hint="Enables text-to-speech readback." />
          <ConsentRow label="Cloud sync" value={consent.cloudSync} onToggle={() => toggleConsent('cloudSync')} hint="Opt-in only. Local-first remains default." />
          <ConsentRow label="Kids mode voice" value={consent.kidsVoiceEnabled} onToggle={() => toggleConsent('kidsVoiceEnabled')} hint="Disabled by default for safety." />
        </Section>

        <Section title="Data controls">
          <p className="text-sm text-muted-foreground">Raw audio is not stored. Transcripts are local-only unless you opt in to cloud sync.</p>
          <Button variant="outline" className="w-full gap-2" onClick={clearKnowledge}><RotateCcw className="h-4 w-4" />Reset local memory</Button>
          <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30" onClick={() => { resetAllData(); navigate('/onboarding'); }}><Trash2 className="h-4 w-4" />Delete all local history</Button>
          <p className="text-xs text-muted-foreground">Interactions tracked locally: {getKnowledge().interactionCount}</p>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4"><h2 className="text-lg font-display font-semibold">{title}</h2>{children}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><label className="text-sm text-muted-foreground">{label}</label>{children}</div>;
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className={`rounded-lg border px-3 py-1.5 text-sm ${value === o.value ? 'border-primary bg-accent/60' : 'border-border'}`}>{o.label}</button>
      ))}
    </div>
  );
}

function ConsentRow({ label, value, onToggle, hint }: { label: string; value: boolean; onToggle: () => void; hint: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <Button size="sm" variant={value ? 'default' : 'outline'} onClick={onToggle}>{value ? 'Enabled' : 'Disabled'}</Button>
      </div>
    </div>
  );
}
