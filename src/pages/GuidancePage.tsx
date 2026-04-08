import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { GlowOrb } from '@/components/GlowOrb';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAIAdapter } from '@/lib/adapters';
import { getProfile, savePassage } from '@/lib/storage';
import { checkInputSafety, shouldCircuitBreak, SAFE_FALLBACK_RESPONSE } from '@/lib/safety';
import type { GuidanceResult, SavedPassage } from '@/types';
import { Send, AlertCircle } from 'lucide-react';

export default function GuidancePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [safetyMessage, setSafetyMessage] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSubmit() {
    if (!input.trim()) return;
    setSafetyMessage('');
    setSaved(false);

    if (shouldCircuitBreak()) {
      setSafetyMessage("Let's take a gentle pause. Here is a passage to rest with.");
      setResult({
        id: 'circuit-break',
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What do you most need right now?'],
        createdAt: new Date().toISOString(),
      });
      setInput('');
      return;
    }

    const safety = checkInputSafety(input);
    if (!safety.safe) {
      setSafetyMessage(safety.reason || 'Let me offer you a scripture instead.');
      setResult({
        id: 'safety-fallback',
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: safety.reason || SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What would bring you peace right now?'],
        createdAt: new Date().toISOString(),
      });
      setInput('');
      return;
    }

    setLoading(true);
    try {
      const profile = getProfile();
      const ai = getAIAdapter();
      const guidance = await ai.generateGuidance(input, profile?.toneStyle || 'balanced');
      setResult(guidance);
      setInput('');
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!result || saved) return;
    const entry: SavedPassage = {
      id: crypto.randomUUID(),
      passage: result.passage,
      note: result.pastoralFraming,
      savedAt: new Date().toISOString(),
    };
    savePassage(entry);
    setSaved(true);
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <div className="text-center space-y-2">
          <GlowOrb size="sm" className="mx-auto" />
          <h1 className="text-2xl font-serif font-semibold">Guidance</h1>
          <p className="text-sm text-muted-foreground">Share what's on your heart. I'll offer scripture and a gentle reflection.</p>
        </div>

        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What's weighing on you today? You can share anything here..."
            className="min-h-[100px] resize-none bg-card"
            maxLength={500}
          />
          <Button onClick={handleSubmit} disabled={loading || !input.trim()} className="w-full gap-2">
            <Send className="h-4 w-4" />
            {loading ? 'Finding light...' : 'Seek Guidance'}
          </Button>
        </div>

        {safetyMessage && (
          <div className="flex items-start gap-2 bg-accent/60 rounded-lg p-4 animate-fade-in">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{safetyMessage}</p>
          </div>
        )}

        {result && (
          <div className="space-y-5 animate-slide-up">
            {result.themes.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {result.themes.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground font-medium capitalize">{t}</span>
                ))}
              </div>
            )}

            <ScriptureCard passage={result.passage} onSave={handleSave} saved={saved} />

            <ReflectionBlock label="Pastoral Reflection" content={result.pastoralFraming} variant="reflection" />

            {result.reflectionQuestions.length > 0 && (
              <div className="rounded-lg bg-secondary/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-sage">Questions to Sit With</p>
                <ul className="space-y-2">
                  {result.reflectionQuestions.map((q, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary font-medium shrink-0">{i + 1}.</span> {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.prayer && (
              <ReflectionBlock label="Prayer" content={result.prayer} variant="prayer" />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
