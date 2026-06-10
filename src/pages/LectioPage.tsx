import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  getLectioSteps,
  completeLectio,
  type LectioResponses,
} from '@/lib/lectio/lectioFlow';
import { getDailyLight } from '@/lib/dailyLight';
import { getProfile, updateStreak } from '@/lib/storage';
import type { ToneStyle } from '@/types';

export default function LectioPage() {
  const navigate = useNavigate();
  const profile = useMemo(() => getProfile(), []);
  const tone: ToneStyle = profile?.toneStyle ?? 'balanced';
  const steps = useMemo(() => getLectioSteps(tone), [tone]);
  const today = useMemo(() => getDailyLight(), []);

  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>(() =>
    Object.fromEntries(steps.map((s) => [s.id, ''])),
  );

  function handleNext() {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Persist responses, set relatedPassage, fire resonance signals.
      completeLectio(responses as LectioResponses, today.passage, tone);
      updateStreak();
      navigate('/app');
    }
  }

  const current = steps[step];

  return (
    <AppShell>
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto min-h-[80vh] flex flex-col justify-center animate-fade-in">
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold text-center">
            {current.latin} — {step + 1} of {steps.length}
          </p>
          <h2 className="text-3xl font-serif text-foreground text-center">
            {current.title}
          </h2>

          {/* Show the passage on the first step (Lectio = Reading) */}
          {step === 0 && (
            <p className="scripture-text text-base text-center border-l-2 border-primary/40 pl-4 py-2">
              {today.passage.text}
              <span className="block text-xs text-muted-foreground mt-1 not-italic">
                — {today.passage.reference}
              </span>
            </p>
          )}

          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            {current.prompt}
          </p>
          <Textarea
            value={responses[current.id] ?? ''}
            onChange={(e) =>
              setResponses((prev) => ({ ...prev, [current.id]: e.target.value }))
            }
            placeholder={current.placeholder}
            className="min-h-[100px] resize-none bg-card mt-2"
            maxLength={1000}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3">
          <Button onClick={handleNext} size="lg" className="w-full text-lg shadow-sm">
            {step < steps.length - 1 ? 'Continue' : 'Complete'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/app')}
            className="w-full text-muted-foreground"
          >
            End early
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
