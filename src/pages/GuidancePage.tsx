// GuidancePage - AI guidance with voice, runtime, consent controls
import { useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AgentPresence } from '@/components/agent/AgentPresence';
import { AgentRuntime } from '@/lib/runtime/agentRuntime';
import { VoiceOrchestrator } from '@/lib/runtime/voiceOrchestrator';
import { getProfile, getConsentSettings, savePassage } from '@/lib/storage';
import type { GuidanceResult, SavedPassage } from '@/types';
import { Mic, Send, Volume2, Square, RotateCcw } from 'lucide-react';

export default function GuidancePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [runtimeState, setRuntimeState] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'muted' | 'disabled' | 'error'>('idle');
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [rate, setRate] = useState(1);

  const runtime = useMemo(() => new AgentRuntime(), []);
  const voice = useMemo(() => new VoiceOrchestrator(), []);
  const consent = getConsentSettings();

  async function handleSubmit(nextInput = input) {
    if (!nextInput.trim()) return;
    setSaved(false);
    setLoading(true);
    setRuntimeState('thinking');
    try {
      const profile = getProfile();
      const guidance = await runtime.respond(nextInput, profile?.toneStyle || 'balanced');
      setResult(guidance);
      setInput('');
      setTranscriptPreview('');
      setRuntimeState('idle');
    } catch {
      setRuntimeState('error');
    } finally {
      setLoading(false);
    }
  }

  async function handleMic() {
    if (!consent.microphone) {
      setTranscriptPreview('Microphone access is disabled in settings.');
      setRuntimeState('disabled');
      return;
    }
    setRuntimeState('listening');
    try {
      const transcript = await voice.captureTranscript();
      setTranscriptPreview(transcript || 'No speech detected.');
      setRuntimeState('idle');
    } catch {
      setRuntimeState('error');
    }
  }

  async function readAloud() {
    if (!result || !consent.voicePlayback) return;
    setRuntimeState('speaking');
    await voice.speak(`${result.passage.reference}. ${result.pastoralFraming}`, rate);
    setRuntimeState('idle');
  }

  function stopReading() {
    voice.stopSpeaking();
    runtime.cancel();
    setRuntimeState('idle');
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
      <div className="px-4 pt-8 pb-6 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <AgentPresence state={runtimeState} muted={!consent.voicePlayback} intensity={runtimeState === 'speaking' ? 0.8 : 0.3} />
          <h1 className="text-2xl font-display font-semibold tracking-wide">Guidance</h1>
          <p className="text-sm text-muted-foreground">Share what is on your heart. Scripture and reflection will be kept separate.</p>
        </div>

        <div className="space-y-3">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="What is weighing on you today?" className="min-h-[110px]" maxLength={500} />
          {transcriptPreview && (
            <div className="rounded-lg border border-border bg-secondary/50 p-3 text-sm">
              <p className="font-medium">Transcript preview</p>
              <p className="text-muted-foreground">{transcriptPreview}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSubmit(transcriptPreview)}>Submit transcript</Button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button onClick={() => handleSubmit()} disabled={loading || !input.trim()} className="gap-2"><Send className="h-4 w-4" />Send</Button>
            <Button onClick={handleMic} variant="outline" className="gap-2"><Mic className="h-4 w-4" />Mic</Button>
            <Button onClick={readAloud} variant="outline" disabled={!result || !consent.voicePlayback} className="gap-2"><Volume2 className="h-4 w-4" />Play</Button>
            <Button onClick={stopReading} variant="outline" className="gap-2"><Square className="h-4 w-4" />Stop</Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground font-ui">Voice speed</label>
            <input type="range" min={0.8} max={1.3} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            <Button size="sm" variant="ghost" onClick={() => setRate(1)}><RotateCcw className="h-3 w-3" /></Button>
          </div>
        </div>

        {result && (
          <div className="space-y-5 animate-slide-up">
            <ScriptureCard passage={result.passage} onSave={handleSave} saved={saved} />
            <ReflectionBlock label="Reflection" content={result.pastoralFraming} variant="reflection" />
            {result.prayer && <ReflectionBlock label="Prayer" content={result.prayer} variant="prayer" />}
          </div>
        )}
      </div>
    </AppShell>
  );
}
