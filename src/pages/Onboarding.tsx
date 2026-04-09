import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AgentPresence } from '@/components/AgentPresence';
import { saveProfile } from '@/lib/storage';
import type { UserProfile, ToneStyle, FaithFamiliarity, ReadingPreference } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'welcome' | 'setup' | 'complete'>('welcome');
  const [firstName, setFirstName] = useState('');
  const [tone, setTone] = useState<ToneStyle>('balanced');
  const [faith, setFaith] = useState<FaithFamiliarity>('familiar');
  const [readingPref, setReadingPref] = useState<ReadingPreference>('balanced');

  function finish() {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      firstName: firstName.trim() || 'Friend',
      toneStyle: tone,
      faithFamiliarity: faith,
      preferredUses: ['daily'],
      kidsMode: false,
      readingPreference: readingPref,
      notificationsEnabled: false,
      notificationTime: '07:00',
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);
    navigate('/');
  }

  const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40'
      }`}
    >
      {children}
    </button>
  );

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center space-y-6 animate-fade-in">
          <AgentPresence size="lg" className="mx-auto" />
          <h1 className="text-3xl font-serif font-semibold text-foreground">LampStand</h1>
          <p className="text-muted-foreground leading-relaxed">
            A gentle companion for your journey through scripture. No pressure, no judgment — just light for the path ahead.
          </p>
          <Button onClick={() => setStep('setup')} className="w-full mt-4 gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-serif font-semibold">Quick Setup</h2>
            <p className="text-sm text-muted-foreground">Just a few choices to personalize your experience.</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Your first name</label>
            <Input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Optional"
              className="text-base"
              maxLength={50}
            />
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tone</label>
            <div className="flex flex-wrap gap-2">
              <Chip selected={tone === 'gentle'} onClick={() => setTone('gentle')}>Gentle</Chip>
              <Chip selected={tone === 'balanced'} onClick={() => setTone('balanced')}>Balanced</Chip>
              <Chip selected={tone === 'traditional'} onClick={() => setTone('traditional')}>Traditional</Chip>
            </div>
          </div>

          {/* Faith level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Faith familiarity</label>
            <div className="flex flex-wrap gap-2">
              <Chip selected={faith === 'new'} onClick={() => setFaith('new')}>New / Returning</Chip>
              <Chip selected={faith === 'familiar'} onClick={() => setFaith('familiar')}>Familiar</Chip>
              <Chip selected={faith === 'very-familiar'} onClick={() => setFaith('very-familiar')}>Very Familiar</Chip>
            </div>
          </div>

          {/* Reading style */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reading style</label>
            <div className="flex flex-wrap gap-2">
              <Chip selected={readingPref === 'modern'} onClick={() => setReadingPref('modern')}>Modern</Chip>
              <Chip selected={readingPref === 'balanced'} onClick={() => setReadingPref('balanced')}>Balanced</Chip>
              <Chip selected={readingPref === 'traditional'} onClick={() => setReadingPref('traditional')}>Traditional</Chip>
            </div>
          </div>

          <Button onClick={finish} className="w-full gap-2 mt-2">
            Enter LampStand <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
