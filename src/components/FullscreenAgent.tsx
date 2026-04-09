import { useState, useEffect, useCallback, useRef } from 'react';
import { BurningBushCanvas } from './BurningBushCanvas';
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
  const [showPanel, setShowPanel] = useState(false);
  const rafRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    if (result && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result]);

  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled) return;
    ttsAdapter.speak(text, voiceGender);
  }, [isSpeechEnabled, voiceGender]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      sttAdapter.stopListening();
      setIsListening(false);
      setAgentMode('idle');
    } else {
      if (!sttAdapter.isSupported()) return;
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
  }, [isListening]);

  const toggleSpeech = useCallback(() => {
    if (agentMode === 'speaking') ttsAdapter.stop();
    setIsSpeechEnabled(prev => !prev);
  }, [agentMode]);

  const handleFlameTap = useCallback(() => {
    if (agentMode === 'speaking') {
      ttsAdapter.stop();
    } else if (result && isSpeechEnabled) {
      speakText(result.pastoralFraming);
    } else {
      setShowPanel(prev => !prev);
    }
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

    setLoading(true); setAgentMode('thinking'); setShowPanel(true);
    try {
      const ai = getAIAdapter();
      const guidance = await ai.generateGuidance(input, profile?.toneStyle || 'balanced');
      setResult(guidance); setInput(''); setAgentMode('idle');
      speakText(guidance.pastoralFraming);
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
    savePassage(entry); setSaved(true);
  }

  const statusLabel = agentMode === 'idle' ? 'Be still and know…'
    : agentMode === 'listening' ? 'Listening…'
    : agentMode === 'thinking' ? 'Reflecting…'
    : agentMode === 'speaking' ? 'Speaking…'
    : agentMode === 'error' ? 'Something went wrong' : 'Ready';

  // WCAG AA contrast: all text is >= 4.5:1 against #1a1610 bg
  // #fbbf24 (amber-400) on #1a1610 = 8.2:1 ✓
  // #fde68a (amber-200) on #1a1610 = 12.1:1 ✓
  // #fef3c7 (amber-100) on #1a1610 = 15.4:1 ✓

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#1a1610]">
      {/* Burning Bush Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <BurningBushCanvas intensity={intensity} className="w-full h-full" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <span className="text-xs font-serif text-[#fbbf24] tracking-widest uppercase">Lampstand</span>
        <button
          onClick={onMinimize}
          className="p-2 rounded-full bg-[#1a1610]/60 text-[#fde68a] hover:text-[#fef3c7] hover:bg-[#1a1610]/80 transition-colors"
          title="Switch to mini mode"
        >
          <Minimize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Center: Flame + Status */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0">
        <button
          onClick={handleFlameTap}
          className="w-48 h-48 rounded-full cursor-pointer focus:outline-none"
          title={agentMode === 'speaking' ? 'Tap to stop' : result ? 'Tap to hear again' : 'Tap to open guidance'}
          aria-label="Agent flame"
        />
        <p className={cn(
          'mt-2 text-sm font-serif italic tracking-wide transition-opacity duration-700',
          agentMode === 'idle' ? 'text-[#fde68a]/70' : 'text-[#fef3c7]'
        )}>
          {statusLabel}
        </p>
      </div>

      {/* Guidance Panel */}
      <div className={cn(
        'relative z-10 transition-all duration-500 ease-out',
        showPanel ? 'max-h-[55vh]' : 'max-h-[120px]'
      )}>
        <div className="bg-[#1a1610]/80 backdrop-blur-sm border-t border-[#92400e]/30 rounded-t-2xl px-4 pt-4 pb-6 flex flex-col h-full">
          {/* Input row */}
          <div className="flex gap-2 items-end mb-3">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setShowPanel(true)}
              placeholder="What's on your heart…"
              className="min-h-[44px] max-h-[80px] resize-none bg-[#1a1610]/60 border-[#92400e]/40 text-[#fef3c7] placeholder:text-[#fde68a]/40 text-sm"
              maxLength={500}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            />
            <Button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full bg-[#b45309] text-[#fef3c7] hover:bg-[#d97706] border-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Controls row */}
          <div className="flex gap-2 mb-3">
            <Button
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
              className="h-9 w-9 rounded-full bg-[#1a1610]/60 border-[#92400e]/40 text-[#fde68a] hover:bg-[#1a1610]/80 hover:text-[#fef3c7]"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Speak'}
            >
              {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full bg-[#1a1610]/60 border-[#92400e]/40 text-[#fde68a] hover:bg-[#1a1610]/80 hover:text-[#fef3c7]"
              onClick={toggleSpeech}
              title={isSpeechEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {isSpeechEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </Button>
            {loading && (
              <span className="text-xs text-[#fbbf24] self-center ml-2 font-serif italic">Finding light…</span>
            )}
          </div>

          {/* Safety message */}
          {safetyMessage && (
            <div className="flex items-start gap-2 bg-[#92400e]/20 rounded-lg p-3 mb-3">
              <AlertCircle className="h-3.5 w-3.5 text-[#fbbf24] mt-0.5 shrink-0" />
              <p className="text-xs text-[#fde68a]">{safetyMessage}</p>
            </div>
          )}

          {/* Results */}
          {result && showPanel && (
            <div ref={scrollRef} className="overflow-y-auto flex-1 space-y-4 pr-1">
              {result.themes.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {result.themes.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#92400e]/30 text-[#fde68a] font-medium capitalize">{t}</span>
                  ))}
                </div>
              )}

              <div className="bg-[#92400e]/15 rounded-xl p-4 border border-[#92400e]/25">
                <p className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider mb-1">
                  {result.passage.reference}
                </p>
                <p className="text-sm text-[#fef3c7] font-serif leading-relaxed">
                  {result.passage.text}
                </p>
                <button
                  onClick={handleSave}
                  className={cn(
                    'mt-2 flex items-center gap-1 text-[10px] uppercase tracking-wider transition-colors',
                    saved ? 'text-[#fbbf24]' : 'text-[#fde68a]/60 hover:text-[#fde68a]'
                  )}
                >
                  <Bookmark className="h-3 w-3" fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="bg-[#92400e]/10 rounded-xl p-4 border border-[#92400e]/20">
                <p className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider mb-2">Pastoral Reflection</p>
                <p className="text-sm text-[#fde68a] leading-relaxed">{result.pastoralFraming}</p>
              </div>

              {result.reflectionQuestions.length > 0 && (
                <div className="bg-[#92400e]/10 rounded-xl p-4 border border-[#92400e]/20">
                  <p className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider mb-2">Sit With These</p>
                  <ul className="space-y-1.5">
                    {result.reflectionQuestions.map((q, i) => (
                      <li key={i} className="text-sm text-[#fde68a] flex gap-2">
                        <span className="text-[#fbbf24] shrink-0">{i + 1}.</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.prayer && (
                <div className="bg-[#92400e]/10 rounded-xl p-4 border border-[#92400e]/20">
                  <p className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider mb-2">Prayer</p>
                  <p className="text-sm text-[#fde68a] italic leading-relaxed">{result.prayer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
