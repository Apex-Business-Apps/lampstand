import { useMemo, useState, useCallback } from 'react';
import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { AgentPresence } from '@/components/AgentPresence';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, savePassage } from '@/lib/storage';
import { checkInputSafety, shouldCircuitBreak, SAFE_FALLBACK_RESPONSE } from '@/lib/safety';
import type { GuidanceResult, SavedPassage } from '@/types';
import { Send, AlertCircle, Mic, MicOff, Volume2, VolumeX, PictureInPicture2 } from 'lucide-react';
import { sttAdapter, ttsAdapter } from '@/lib/voice';
import type { AgentMode } from '@/components/AgentPresence';
import type { VoiceGender } from '@/lib/voice';
import { AgentRuntime } from '@/lib/runtime/agentRuntime';

export default function GuidancePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [safetyMessage, setSafetyMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [agentMode, setAgentMode] = useState<AgentMode>('idle');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  const profile = getProfile();
  const voiceGender: VoiceGender = profile?.voiceGender || 'male';
  const runtime = useMemo(
    () =>
      new AgentRuntime({
        voice: {
          speak: (text) => ttsAdapter.speak(text, voiceGender),
          stop: () => ttsAdapter.stop(),
        },
      }),
    [voiceGender],
  );

  // Wire TTS state to agent mode
  ttsAdapter.onStateChange = (state) => {
    if (state === 'speaking') setAgentMode('speaking');
    else if (state === 'loading') setAgentMode('thinking');
    else setAgentMode('idle');
  };

  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled) return;
    runtime.speak(text);
  }, [isSpeechEnabled, runtime]);

  async function toggleListening() {
    if (isListening) {
      sttAdapter.stopListening();
      setIsListening(false);
      setAgentMode('idle');
    } else {
      try {
        setIsListening(true);
        setAgentMode('listening');
        const text = await sttAdapter.startListening();
        setInput(prev => (prev + ' ' + text).trim());
        setIsListening(false);
        setAgentMode('idle');
      } catch {
        setIsListening(false);
        setAgentMode('error');
        setTimeout(() => setAgentMode('idle'), 2000);
      }
    }
  }

  function toggleSpeech() {
    if (agentMode === 'speaking') {
      ttsAdapter.stop();
    } else if (result) {
      speakText(result.pastoralFraming);
    }
  }

  function toggleAutoSpeech() {
    if (isSpeechEnabled) {
      ttsAdapter.stop();
    }
    setIsSpeechEnabled(prev => !prev);
  }

  async function handleSubmit() {
    if (!input.trim()) return;
    setSafetyMessage('');
    setSaved(false);
    ttsAdapter.stop();

    if (shouldCircuitBreak()) {
      setSafetyMessage("Let's take a gentle pause. Here is a passage to rest with.");
      const r: GuidanceResult = {
        id: 'circuit-break',
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What do you most need right now?'],
        createdAt: new Date().toISOString(),
      };
      setResult(r);
      setInput('');
      speakText(r.pastoralFraming);
      return;
    }

    const safety = checkInputSafety(input);
    if (!safety.safe) {
      const msg = safety.reason || 'Let me offer you a scripture instead.';
      setSafetyMessage(msg);
      const r: GuidanceResult = {
        id: 'safety-fallback',
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: msg,
        reflectionQuestions: ['What would bring you peace right now?'],
        createdAt: new Date().toISOString(),
      };
      setResult(r);
      setInput('');
      speakText(r.pastoralFraming);
      return;
    }

    setLoading(true);
    setAgentMode('thinking');
    try {
      const guidance = await runtime.handleTextTurn({
        input,
        tone: profile?.toneStyle || 'balanced',
      });
      if (guidance.id === 'circuit-breaker-fallback') {
        setSafetyMessage("Let's take a gentle pause. Here is a passage to rest with.");
      }
      setResult(guidance);
      setInput('');
      setAgentMode('idle');
      speakText(guidance.pastoralFraming);
    } finally {
      setLoading(false);
      if (agentMode === 'thinking') setAgentMode('idle');
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
        {/* Header with Agent */}
        <div className="text-center space-y-2">
          <div onClick={toggleSpeech} className="cursor-pointer" title={agentMode === 'speaking' ? 'Stop speaking' : 'Read aloud'}>
            <AgentPresence size="sm" className="mx-auto" mode={agentMode} />
          </div>
          <h1 className="text-2xl font-serif font-semibold">Guidance</h1>
          <p className="text-sm text-muted-foreground">Share what's on your heart. I'll offer scripture and a gentle reflection.</p>
        </div>

        {/* Input area */}
        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What's weighing on you today? You can share anything here..."
            className="min-h-[100px] resize-none bg-card"
            maxLength={500}
          />
          <div className="flex gap-2">
            {/* Mic button */}
            <Button
              onClick={toggleListening}
              variant={isListening ? 'destructive' : 'outline'}
              className="shrink-0"
              disabled={loading}
              title={isListening ? 'Stop listening' : 'Speak your concern'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {/* TTS toggle button */}
            <Button
              onClick={toggleAutoSpeech}
              variant="outline"
              className="shrink-0"
              title={isSpeechEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            {/* Submit */}
            <Button onClick={handleSubmit} disabled={loading || !input.trim()} className="w-full gap-2">
              <Send className="h-4 w-4" />
              {loading ? 'Finding light...' : 'Seek Guidance'}
            </Button>
          </div>
        </div>

        {/* Safety message */}
        {safetyMessage && (
          <div className="flex items-start gap-2 bg-accent/60 rounded-lg p-4 animate-fade-in">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{safetyMessage}</p>
          </div>
        )}

        {/* Results */}
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
