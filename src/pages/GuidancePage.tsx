import { useState, useCallback, useMemo } from 'react';
import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { AgentPresence } from '@/components/AgentPresence';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, savePassage, incrementPresenceScore } from '@/lib/storage';
import type { GuidanceResult, SavedPassage } from '@/types';
import { Send, Mic, MicOff, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { sttAdapter, ttsAdapter } from '@/lib/voice';
import type { AgentMode } from '@/components/AgentPresence';
import type { VoiceGender } from '@/lib/voice';
import { agentRuntime } from '@/lib/runtime/agentRuntime';
import { recordSignal } from '@/lib/resonance/ResonanceEngine';

export default function GuidancePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [agentMode, setAgentMode] = useState<AgentMode>('idle');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [transcriptPreview, setTranscriptPreview] = useState('');

  const profile = useMemo(() => getProfile(), []);
  const voiceGender: VoiceGender = profile?.voiceGender || 'male';

  ttsAdapter.onStateChange = (state) => {
    if (state === 'speaking') setAgentMode('speaking');
    else if (state === 'loading') setAgentMode('thinking');
    else setAgentMode('idle');
  };

  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled) return;
    ttsAdapter.speak(text, voiceGender);
  }, [isSpeechEnabled, voiceGender]);

  async function toggleListening() {
    if (isListening) {
      sttAdapter.stopListening();
      setIsListening(false);
      setAgentMode('idle');
      return;
    }
    try {
      setIsListening(true);
      setAgentMode('listening');
      const text = await sttAdapter.startListening();
      setTranscriptPreview(text);
      setIsListening(false);
      setAgentMode('idle');
    } catch {
      setIsListening(false);
      setAgentMode('error');
      setTimeout(() => setAgentMode('idle'), 2000);
    }
  }

  function applyTranscript() {
    if (!transcriptPreview.trim()) return;
    setInput((prev) => `${prev} ${transcriptPreview}`.trim());
    setTranscriptPreview('');
  }

  async function handleSubmit() {
    if (!input.trim()) return;
    setSaved(false);
    setLoading(true);
    try {
      const guidance = await agentRuntime.runGuidance(input, profile?.toneStyle || 'balanced');
      setResult(guidance);
      setInput('');
      incrementPresenceScore(4);
      // Resonance: user actively sought guidance — informs season + tone.
      try {
        recordSignal({
          signal: 'guided',
          passage: guidance.passage,
          theme: guidance.theme,
          tone: profile?.toneStyle || 'balanced',
        });
      } catch { /* ignore */ }
      speakText(guidance.pastoralFraming);
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
    // Saving from a guidance result is the strongest engagement signal we get
    // on this surface — record it as both 'saved' and 'reflected' so the
    // fingerprint captures both the passage affinity and the depth of intent.
    try {
      recordSignal({ signal: 'saved', passage: result.passage, theme: result.theme });
      recordSignal({ signal: 'reflected', passage: result.passage, theme: result.theme });
    } catch { /* ignore */ }
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <div className="text-center space-y-2">
          <div onClick={() => (agentMode === 'speaking' ? ttsAdapter.stop() : result && speakText(result.pastoralFraming))} className="cursor-pointer" title={agentMode === 'speaking' ? 'Stop speaking' : 'Read aloud'}>
            <AgentPresence size="sm" className="mx-auto" mode={agentMode} />
          </div>
          <h1 className="text-2xl font-serif font-semibold">Guidance</h1>
          <p className="text-sm text-muted-foreground">Share what is on your heart. Scripture appears first, then reflection.</p>
        </div>

        <div className="space-y-3">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="What is weighing on you today?" className="min-h-[100px] resize-none bg-card" maxLength={500} />
          {transcriptPreview && (
            <div className="rounded-lg border border-primary/30 bg-accent/40 p-3 space-y-2">
              <p className="text-xs font-medium">Transcript preview</p>
              <p className="text-sm text-muted-foreground">{transcriptPreview}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={applyTranscript}>Use transcript</Button>
                <Button size="sm" variant="ghost" onClick={() => setTranscriptPreview('')}>Discard</Button>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'outline'} className="shrink-0" disabled={loading}>
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={() => setIsSpeechEnabled((prev) => !prev)} variant="outline" className="shrink-0">
              {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button onClick={() => ttsAdapter.replay(voiceGender)} variant="outline" className="shrink-0" disabled={!result}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !input.trim()} className="w-full gap-2">
              <Send className="h-4 w-4" />
              {loading ? 'Finding light...' : 'Seek Guidance'}
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-5 animate-slide-up">
            <ScriptureCard passage={result.passage} onSave={handleSave} saved={saved} />
            <ReflectionBlock label="Pastoral Reflection" content={result.pastoralFraming} variant="reflection" />
            {result.prayer && <ReflectionBlock label="Prayer" content={result.prayer} variant="prayer" />}
          </div>
        )}
      </div>
    </AppShell>
  );
}
