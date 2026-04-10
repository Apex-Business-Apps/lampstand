import { useState, useEffect, useCallback, useRef } from 'react';
import { BurningBushCanvas } from './BurningBushCanvas';
import { AgentPresence } from './AgentPresence';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Mic, MicOff, Volume2, VolumeX, Minimize2, Send, AlertCircle, Bookmark } from 'lucide-react';
import { sttAdapter, ttsAdapter } from '@/lib/voice';
import { audioAnalyzer } from '@/lib/audioAnalyzer';
import { getAIAdapter } from '@/lib/adapters';
import { getProfile, savePassage } from '@/lib/storage';
import { checkInputSafety, shouldCircuitBreak, SAFE_FALLBACK_RESPONSE } from '@/lib/safety';
import { cn } from '@/lib/utils';
import type { AgentMode } from './AgentPresence';
import type { VoiceGender } from '@/lib/voice';
import type { GuidanceResult, SavedPassage } from '@/types';

interface FullscreenAgentProps {
  onMinimize: () => void;
}

const quickPrompts = [
  'I need peace right now',
  'Help me process anxiety tonight',
  'Give me a short prayer for strength',
];

export function FullscreenAgent({ onMinimize }: FullscreenAgentProps) {
  const [agentMode, setAgentMode] = useState<AgentMode>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [intensity, setIntensity] = useState(0.15);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [safetyMessage, setSafetyMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const rafRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const profile = getProfile();
  const voiceGender: VoiceGender = profile?.voiceGender || 'male';

  useEffect(() => {
    ttsAdapter.onStateChange = (state) => {
      if (state === 'speaking') setAgentMode('speaking');
      else if (state === 'loading') setAgentMode('thinking');
      else setAgentMode('idle');
    };
  }, []);

  useEffect(() => {
    const poll = () => {
      const amp = audioAnalyzer.getAmplitude();
      if (agentMode === 'speaking') {
        setIntensity(Math.max(0.1, amp));
      } else if (agentMode === 'listening') {
        setIntensity(0.3 + Math.sin(Date.now() / 400) * 0.15);
      } else if (agentMode === 'thinking') {
        setIntensity(0.2 + Math.sin(Date.now() / 600) * 0.1);
      } else {
        setIntensity(0.1 + Math.sin(Date.now() / 2000) * 0.05);
      }
      rafRef.current = requestAnimationFrame(poll);
    };
    rafRef.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [agentMode]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [result, safetyMessage]);

  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled) return;
    ttsAdapter.speak(text, voiceGender);
  }, [isSpeechEnabled, voiceGender]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      sttAdapter.stopListening();
      setIsListening(false);
      setAgentMode('idle');
      return;
    }
    if (!sttAdapter.isSupported()) {
      setAgentMode('error');
      setTimeout(() => setAgentMode('idle'), 2500);
      return;
    }
    try {
      setIsListening(true);
      setAgentMode('listening');
      const text = await sttAdapter.startListening();
      setInput((prev) => `${prev} ${text}`.trim());
      setIsListening(false);
      setAgentMode('idle');
      requestAnimationFrame(() => composerRef.current?.focus());
    } catch {
      setIsListening(false);
      setAgentMode('error');
      setTimeout(() => setAgentMode('idle'), 2000);
    }
  }, [isListening]);

  const toggleSpeech = useCallback(() => {
    if (agentMode === 'speaking') ttsAdapter.stop();
    setIsSpeechEnabled((prev) => !prev);
  }, [agentMode]);

  const handleFlameTap = useCallback(() => {
    if (agentMode === 'speaking') { ttsAdapter.stop(); return; }
    if (result && isSpeechEnabled) { speakText(result.pastoralFraming); return; }
    composerRef.current?.focus();
  }, [agentMode, result, isSpeechEnabled, speakText]);

  async function handleSubmit() {
    if (!input.trim()) return;
    setSafetyMessage('');
    setSaved(false);
    ttsAdapter.stop();

    if (shouldCircuitBreak()) {
      setSafetyMessage("Let's take a gentle pause. Here is a passage to rest with.");
      const r: GuidanceResult = {
        id: 'circuit-break', concern: input, themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What do you most need right now?'],
        createdAt: new Date().toISOString(),
      };
      setResult(r); setInput(''); speakText(r.pastoralFraming); return;
    }

    const safety = checkInputSafety(input);
    if (!safety.safe) {
      const msg = safety.reason || 'Let me offer you a scripture instead.';
      setSafetyMessage(msg);
      const r: GuidanceResult = {
        id: 'safety-fallback', concern: input, themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage, pastoralFraming: msg,
        reflectionQuestions: ['What would bring you peace right now?'],
        createdAt: new Date().toISOString(),
      };
      setResult(r); setInput(''); speakText(r.pastoralFraming); return;
    }

    setLoading(true);
    setAgentMode('thinking');
    try {
      const ai = getAIAdapter();
      const guidance = await ai.generateGuidance(input, profile?.toneStyle || 'balanced');
      setResult(guidance); setInput(''); speakText(guidance.pastoralFraming);
    } finally {
      setLoading(false);
      if (agentMode === 'thinking') setAgentMode('idle');
    }
  }

  function handleSave() {
    if (!result || saved) return;
    const entry: SavedPassage = {
      id: crypto.randomUUID(), passage: result.passage,
      note: result.pastoralFraming, savedAt: new Date().toISOString(),
    };
    savePassage(entry);
    setSaved(true);
  }

  const statusLabel =
    agentMode === 'idle' ? 'Be still and know'
      : agentMode === 'listening' ? 'Listening...'
        : agentMode === 'thinking' ? 'Reflecting...'
          : agentMode === 'speaking' ? 'Speaking...'
            : agentMode === 'error' ? 'Something went wrong'
              : 'Ready';

  const statusHelp =
    agentMode === 'speaking'
      ? 'Tap the flame to pause voice'
      : 'Share one clear thought and receive scripture-first guidance';

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1610] text-[#fef3c7] flex flex-col">
      {/* Canvas background – absolute, full bleed */}
      <div className="absolute inset-0 pointer-events-none">
        <BurningBushCanvas intensity={intensity} className="w-full h-full" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full min-h-0">
        {/* Header */}
        <header className="shrink-0 border-b border-[#92400e]/25 bg-[#1a1610]/65 px-3 sm:px-4 pb-2 pt-3 sm:pb-3 sm:pt-4 backdrop-blur-sm safe-top">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.25em] text-[#fbbf24]">LampStand</span>
              <span className="rounded-full border border-[#92400e]/40 bg-[#92400e]/20 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.16em] text-[#fde68a]">
                {agentMode}
              </span>
            </div>
            <button
              onClick={onMinimize}
              className="rounded-full border border-[#92400e]/35 bg-[#1a1610]/70 p-1.5 sm:p-2 text-[#fde68a] transition-colors hover:bg-[#1a1610] hover:text-[#fef3c7]"
              title="Switch to mini mode"
              aria-label="Minimize fullscreen agent"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Agent status + quick prompts */}
        <section className="shrink-0 px-3 sm:px-4 pt-3 sm:pt-4">
          <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#92400e]/30 bg-[#1a1610]/65 p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleFlameTap}
                className="shrink-0 rounded-full border border-[#92400e]/35 bg-[#1a1610]/70 p-1.5 sm:p-2 transition-colors hover:border-[#b45309]/65"
                title={agentMode === 'speaking' ? 'Tap to stop voice' : 'Tap to replay reflection or focus input'}
                aria-label="Agent presence"
              >
                <AgentPresence size="sm" mode={agentMode} intensity={intensity} />
              </button>
              <div className="min-w-0">
                <p className="text-sm font-serif italic text-[#fef3c7]">{statusLabel}</p>
                <p className="mt-0.5 text-[11px] sm:text-xs text-[#fde68a]/70 line-clamp-2">{statusHelp}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); requestAnimationFrame(() => composerRef.current?.focus()); }}
                  className="rounded-full border border-[#92400e]/40 bg-[#1a1610]/60 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs text-[#fde68a] transition-colors hover:border-[#b45309]/70 hover:text-[#fef3c7]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Scrollable response area */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-4 py-3 sm:py-4">
          <div className="mx-auto w-full max-w-3xl space-y-3 sm:space-y-4">
            {safetyMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-[#b45309]/35 bg-[#92400e]/20 p-3">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fbbf24]" />
                <p className="text-xs text-[#fde68a]">{safetyMessage}</p>
              </div>
            )}

            {!result && (
              <div className="rounded-2xl border border-[#92400e]/25 bg-[#1a1610]/55 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#fbbf24]">Conversation Space</p>
                <p className="mt-2 text-sm leading-relaxed text-[#fde68a]">
                  Your guidance will appear here in a clear sequence: scripture, reflection, questions, then prayer.
                </p>
              </div>
            )}

            {result && (
              <>
                {result.themes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {result.themes.map((t) => (
                      <span key={t} className="rounded-full bg-[#92400e]/30 px-2 py-0.5 text-[10px] font-medium capitalize text-[#fde68a]">{t}</span>
                    ))}
                  </div>
                )}

                <section className="rounded-xl border border-[#92400e]/25 bg-[#92400e]/15 p-3 sm:p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">{result.passage.reference}</p>
                  <p className="font-serif text-sm leading-relaxed text-[#fef3c7]">{result.passage.text}</p>
                  <button
                    onClick={handleSave}
                    className={cn(
                      'mt-3 flex items-center gap-1 text-[10px] uppercase tracking-wider transition-colors',
                      saved ? 'text-[#fbbf24]' : 'text-[#fde68a]/70 hover:text-[#fde68a]'
                    )}
                  >
                    <Bookmark className="h-3 w-3" fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </section>

                <section className="rounded-xl border border-[#92400e]/22 bg-[#92400e]/10 p-3 sm:p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">Pastoral Reflection</p>
                  <p className="text-sm leading-relaxed text-[#fde68a]">{result.pastoralFraming}</p>
                </section>

                {result.reflectionQuestions.length > 0 && (
                  <section className="rounded-xl border border-[#92400e]/22 bg-[#92400e]/10 p-3 sm:p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">Sit With These</p>
                    <ul className="space-y-1.5">
                      {result.reflectionQuestions.map((q, i) => (
                        <li key={i} className="flex gap-2 text-sm text-[#fde68a]">
                          <span className="shrink-0 text-[#fbbf24]">{i + 1}.</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {result.prayer && (
                  <section className="rounded-xl border border-[#92400e]/22 bg-[#92400e]/10 p-3 sm:p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">Prayer</p>
                    <p className="text-sm italic leading-relaxed text-[#fde68a]">{result.prayer}</p>
                  </section>
                )}
              </>
            )}
          </div>
        </main>

        {/* Composer — pinned bottom */}
        <section className="shrink-0 border-t border-[#92400e]/30 bg-[#1a1610]/78 px-3 sm:px-4 pb-3 sm:pb-4 pt-2 sm:pt-3 backdrop-blur-md safe-bottom">
          <div className="mx-auto w-full max-w-3xl space-y-2 sm:space-y-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={composerRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What's on your heart..."
                className="min-h-[44px] sm:min-h-[52px] max-h-[90px] sm:max-h-[110px] resize-none border-[#92400e]/45 bg-[#1a1610]/70 text-[#fef3c7] placeholder:text-[#fde68a]/45 text-sm"
                maxLength={500}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                }}
              />
              <Button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                size="icon"
                className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full border-0 bg-[#b45309] text-[#fef3c7] hover:bg-[#d97706]"
                title="Send guidance request"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant={isListening ? 'destructive' : 'outline'}
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-[#92400e]/45 bg-[#1a1610]/70 text-[#fde68a] hover:bg-[#1a1610] hover:text-[#fef3c7]"
                  onClick={toggleListening}
                  title={isListening ? 'Stop listening' : 'Use microphone'}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-[#92400e]/45 bg-[#1a1610]/70 text-[#fde68a] hover:bg-[#1a1610] hover:text-[#fef3c7]"
                  onClick={toggleSpeech}
                  title={isSpeechEnabled ? 'Mute voice playback' : 'Enable voice playback'}
                >
                  {isSpeechEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-[#fde68a]/65">
                {loading && <span className="font-serif italic text-[#fbbf24]">Finding light...</span>}
                <span>{input.length}/500</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
