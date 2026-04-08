import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlowOrb } from '@/components/GlowOrb';
import { saveProfile } from '@/lib/storage';
import type { UserProfile, OnboardingStep, ToneStyle, FaithFamiliarity, UseCase, ReadingPreference } from '@/types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const STEPS: OnboardingStep[] = ['welcome', 'name', 'tone', 'faith', 'use', 'kids', 'notifications', 'reading', 'complete'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [tone, setTone] = useState<ToneStyle>('balanced');
  const [faith, setFaith] = useState<FaithFamiliarity>('familiar');
  const [uses, setUses] = useState<UseCase[]>(['daily']);
  const [kidsMode, setKidsMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [notifTime, setNotifTime] = useState('07:00');
  const [readingPref, setReadingPref] = useState<ReadingPreference>('balanced');

  const currentStep = STEPS[step];

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }
  function finish() {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      firstName,
      toneStyle: tone,
      faithFamiliarity: faith,
      preferredUses: uses,
      kidsMode,
      readingPreference: readingPref,
      notificationsEnabled: notifications,
      notificationTime: notifTime,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);
    navigate('/');
  }

  function toggleUse(u: UseCase) {
    setUses(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u]);
  }

  const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected ? 'border-primary bg-accent/60' : 'border-border bg-card hover:border-primary/40'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        {currentStep === 'welcome' && (
          <div className="text-center space-y-6">
            <GlowOrb size="lg" className="mx-auto" />
            <h1 className="text-3xl font-serif font-semibold text-foreground">Lampstand</h1>
            <p className="text-muted-foreground leading-relaxed">
              A gentle companion for your journey through scripture. No pressure, no judgment — just light for the path ahead.
            </p>
            <Button onClick={next} className="w-full mt-4 gap-2">
              Begin <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {currentStep === 'name' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold">What should we call you?</h2>
            <p className="text-muted-foreground text-sm">Your first name helps us personalize your experience. It stays on your device.</p>
            <Input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="text-lg"
              maxLength={50}
            />
            <Button onClick={next} disabled={!firstName.trim()} className="w-full gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {currentStep === 'tone' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold">How would you like the tone?</h2>
            <p className="text-muted-foreground text-sm">This shapes how reflections and guidance feel.</p>
            <div className="space-y-3">
              <OptionButton selected={tone === 'gentle'} onClick={() => setTone('gentle')}>
                <p className="font-medium">Gentle & Simple</p>
                <p className="text-sm text-muted-foreground">Warm, approachable, easy to absorb</p>
              </OptionButton>
              <OptionButton selected={tone === 'balanced'} onClick={() => setTone('balanced')}>
                <p className="font-medium">Balanced & Reflective</p>
                <p className="text-sm text-muted-foreground">Thoughtful, moderate depth</p>
              </OptionButton>
              <OptionButton selected={tone === 'traditional'} onClick={() => setTone('traditional')}>
                <p className="font-medium">Traditional & Reverent</p>
                <p className="text-sm text-muted-foreground">Deeper, more liturgical feel</p>
              </OptionButton>
            </div>
            <Button onClick={next} className="w-full gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}

        {currentStep === 'faith' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold">Your faith journey</h2>
            <p className="text-muted-foreground text-sm">No right or wrong answer — this just helps us meet you where you are.</p>
            <div className="space-y-3">
              <OptionButton selected={faith === 'new'} onClick={() => setFaith('new')}>
                <p className="font-medium">New or Returning</p>
                <p className="text-sm text-muted-foreground">Just starting or coming back after time away</p>
              </OptionButton>
              <OptionButton selected={faith === 'familiar'} onClick={() => setFaith('familiar')}>
                <p className="font-medium">Somewhat Familiar</p>
                <p className="text-sm text-muted-foreground">I know the basics, want to go deeper</p>
              </OptionButton>
              <OptionButton selected={faith === 'very-familiar'} onClick={() => setFaith('very-familiar')}>
                <p className="font-medium">Very Familiar</p>
                <p className="text-sm text-muted-foreground">I read scripture regularly</p>
              </OptionButton>
            </div>
            <Button onClick={next} className="w-full gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}

        {currentStep === 'use' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold">What brings you here?</h2>
            <p className="text-muted-foreground text-sm">Select all that apply — you can change this later.</p>
            <div className="space-y-3">
              {([
                ['daily', 'Daily Encouragement', 'A gentle word each morning'],
                ['learning', 'Bible Learning', 'Understand scripture in context'],
                ['crisis', 'Crisis Support', 'Comfort during hard times'],
                ['prayer', 'Prayer & Reflection', 'Deepen your prayer life'],
                ['family', 'Family / Kids', 'Share faith with children'],
              ] as [UseCase, string, string][]).map(([key, title, desc]) => (
                <OptionButton key={key} selected={uses.includes(key)} onClick={() => toggleUse(key)}>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </OptionButton>
              ))}
            </div>
            <Button onClick={next} disabled={uses.length === 0} className="w-full gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}

        {currentStep === 'kids' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold">Kids Mode</h2>
            <p className="text-muted-foreground text-sm">
              Enable a safe, simplified experience for children with age-appropriate language and content.
            </p>
            <div className="space-y-3">
              <OptionButton selected={kidsMode} onClick={() => setKidsMode(true)}>
                <p className="font-medium">Yes, enable Kids Mode</p>
                <p className="text-sm text-muted-foreground">Simpler language, friendly, safe content</p>
              </OptionButton>
              <OptionButton selected={!kidsMode} onClick={() => setKidsMode(false)}>
                <p className="font-medium">Not right now</p>
                <p className="text-sm text-muted-foreground">You can enable this later in settings</p>
              </OptionButton>
            </div>
            <Button onClick={next} className="w-full gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}

        {currentStep === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold">Daily Light Notification</h2>
            <p className="text-muted-foreground text-sm">
              A gentle reminder to receive your daily scripture and reflection. No guilt — just a nudge.
            </p>
            <div className="space-y-3">
              <OptionButton selected={notifications} onClick={() => setNotifications(true)}>
                <p className="font-medium">Yes, remind me</p>
                {notifications && (
                  <div className="mt-2">
                    <label className="text-xs text-muted-foreground">Preferred time</label>
                    <Input type="time" value={notifTime} onChange={e => setNotifTime(e.target.value)} className="mt-1 w-32" />
                  </div>
                )}
              </OptionButton>
              <OptionButton selected={!notifications} onClick={() => setNotifications(false)}>
                <p className="font-medium">Not right now</p>
              </OptionButton>
            </div>
            <Button onClick={next} className="w-full gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}

        {currentStep === 'reading' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold">Reading style</h2>
            <p className="text-muted-foreground text-sm">How do you prefer scripture to read?</p>
            <div className="space-y-3">
              <OptionButton selected={readingPref === 'modern'} onClick={() => setReadingPref('modern')}>
                <p className="font-medium">Easier Modern Language</p>
                <p className="text-sm text-muted-foreground">Clear, accessible contemporary translations</p>
              </OptionButton>
              <OptionButton selected={readingPref === 'balanced'} onClick={() => setReadingPref('balanced')}>
                <p className="font-medium">Balanced Readability</p>
                <p className="text-sm text-muted-foreground">A middle ground of clarity and tradition</p>
              </OptionButton>
              <OptionButton selected={readingPref === 'traditional'} onClick={() => setReadingPref('traditional')}>
                <p className="font-medium">More Traditional Language</p>
                <p className="text-sm text-muted-foreground">Classic, reverent phrasing</p>
              </OptionButton>
            </div>
            <Button onClick={next} className="w-full gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center space-y-6">
            <GlowOrb size="md" className="mx-auto" />
            <h2 className="text-2xl font-serif font-semibold">
              Welcome{firstName ? `, ${firstName}` : ''}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your Lampstand is lit. Come as you are, whenever you're ready. There's no rush and no test — just light for the way.
            </p>
            <Button onClick={finish} className="w-full gap-2">
              Enter Lampstand <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step > 0 && currentStep !== 'complete' && (
          <button onClick={back} className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back
          </button>
        )}

        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <div className="flex gap-1 justify-center mt-6">
            {STEPS.slice(1, -1).map((_, i) => (
              <div key={i} className={`h-1 w-6 rounded-full transition-colors ${i <= step - 1 ? 'bg-primary' : 'bg-border'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
