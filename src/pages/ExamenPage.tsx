import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { getPracticePreferences, updateStreak } from '@/lib/storage';

export default function ExamenPage() {
  const navigate = useNavigate();
  const prefs = getPracticePreferences();

  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Steps for full mode
  const fullSteps = [
    { title: "Presence", body: "Remember that you are in the presence of God. Let the day's noise fade into the background." },
    { title: "Gratitude", body: "Review the day with gratitude. What are the gifts you received today?" },
    { title: "Review", body: "Pay attention to your emotions. Where did you feel drawn toward God, and where did you feel pulled away?" },
    { title: "Response", body: "Choose one feature of the day and pray from it. Is there something you need to ask forgiveness for? Something to celebrate?" },
    { title: "Resolve", body: "Look toward tomorrow. Ask for grace to see God's presence in the coming day." }
  ];

  // Steps for short mode
  const shortSteps = [
    { title: "Review & Gratitude", body: "Look back over your day. What brought you life today? Thank God for it." },
    { title: "Release & Resolve", body: "What felt difficult or heavy today? Hand it over, and ask for grace for tomorrow." }
  ];

  const steps = (prefs.practiceLength === 'short' && !expanded) ? shortSteps : fullSteps;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      updateStreak();
      navigate('/app');
    }
  };

  return (
    <AppShell>
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto min-h-[80vh] flex flex-col justify-center animate-fade-in">

        {prefs.practiceLength === 'short' && !expanded && step === 0 && (
          <div className="mb-8 flex justify-center">
            <button onClick={() => setExpanded(true)} className="text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-full hover:bg-surface-elevated transition-colors">
              Take more time today (Full mode)
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold text-center mb-4">
            Step {step + 1} of {steps.length}
          </p>
          <h2 className="text-3xl font-serif text-foreground text-center">
            {steps[step].title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center script-text">
            {steps[step].body}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          <Button onClick={handleNext} size="lg" className="w-full text-lg shadow-sm">
            {step < steps.length - 1 ? 'Continue' : 'Complete'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/app')} className="w-full text-muted-foreground">
            End early
          </Button>
        </div>

      </div>
    </AppShell>
  );
}
