import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Volume2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { AgentPresence } from '@/components/AgentPresence';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, incrementPresenceScore } from '@/lib/storage';
import { ttsAdapter } from '@/lib/voice';
import { toast } from '@/components/ui/use-toast';
import {
  getExamenSteps,
  completeExamen,
  hasCompletedTodayExamen,
  type ExamenResponses,
  type ExamenStepId,
} from '@/lib/examen/examenFlow';

const EMPTY: ExamenResponses = {
  presence: '',
  gratitude: '',
  review: '',
  sorrow: '',
  resolve: '',
};

export default function ExamenPage() {
  const navigate = useNavigate();
  const profile = useMemo(() => getProfile(), []);
  const tone = profile?.toneStyle || 'balanced';
  const voice = profile?.voiceGender || 'male';
  const steps = useMemo(() => getExamenSteps(tone), [tone]);

  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<ExamenResponses>(EMPTY);
  const [done, setDone] = useState(false);
  const [agentMode, setAgentMode] = useState<'idle' | 'speaking'>('idle');

  // If already completed today, show the gentle "already prayed" state.
  useEffect(() => {
    if (hasCompletedTodayExamen()) setDone(true);
  }, []);

  // TTS state hook (non-blocking).
  useEffect(() => {
    ttsAdapter.onStateChange = (s) => setAgentMode(s === 'speaking' ? 'speaking' : 'idle');
    return () => { try { ttsAdapter.stop(); } catch { /* ignore */ } };
  }, []);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  function update(id: ExamenStepId, value: string) {
    setResponses((r) => ({ ...r, [id]: value.slice(0, 1500) }));
  }

  function speak() {
    try { ttsAdapter.speak(step.prompt, voice); } catch { /* ignore */ }
  }

  function next() {
    if (isLast) {
      try {
        completeExamen(responses, tone);
        incrementPresenceScore(6);
        setDone(true);
        toast({ title: 'Examen complete', description: 'Saved to your journal.' });
      } catch {
        toast({ title: 'Could not save', description: 'Please try again.', variant: 'destructive' });
      }
      return;
    }
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    if (index === 0) { navigate(-1); return; }
    setIndex((i) => Math.max(0, i - 1));
  }

  if (done) {
    return (
      <AppShell>
        <div className="px-5 pt-10 pb-8 space-y-6 text-center">
          <AgentPresence size="lg" className="mx-auto" />
          <h1 className="text-2xl font-serif font-semibold">Examen Complete</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Rest in the quiet you just made. Your reflection has been saved to your journal.
          </p>
          <div className="flex flex-col gap-2 max-w-xs mx-auto">
            <Button onClick={() => navigate('/journal')} variant="outline">Open Journal</Button>
            <Button onClick={() => navigate('/app')}>Return Home</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <div className="text-center space-y-2">
          <AgentPresence size="sm" className="mx-auto" mode={agentMode === 'speaking' ? 'speaking' : 'idle'} />
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">The Daily Examen</p>
          <h1 className="text-2xl font-serif font-semibold">{step.title}</h1>
        </div>

        <div className="flex items-center justify-center gap-1.5" aria-label={`Step ${index + 1} of ${steps.length}`}>
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-primary' : i < index ? 'w-4 bg-primary/60' : 'w-4 bg-muted'}`}
            />
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <p className="scripture-text text-base flex-1">{step.prompt}</p>
            <button
              onClick={speak}
              aria-label="Read prompt aloud"
              className="shrink-0 rounded-full p-2 text-primary hover:bg-accent/50"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
          <Textarea
            value={responses[step.id]}
            onChange={(e) => update(step.id, e.target.value)}
            placeholder={step.placeholder}
            className="min-h-[140px] resize-none bg-background"
            maxLength={1500}
          />
          <p className="text-[11px] text-muted-foreground text-right">
            {responses[step.id].length}/1500
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={back} variant="outline" className="flex-1 gap-2">
            <ArrowLeft className="h-4 w-4" /> {index === 0 ? 'Exit' : 'Back'}
          </Button>
          <Button onClick={next} className="flex-1 gap-2">
            {isLast ? (<><Check className="h-4 w-4" /> Complete</>) : (<>Next <ArrowRight className="h-4 w-4" /></>)}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
