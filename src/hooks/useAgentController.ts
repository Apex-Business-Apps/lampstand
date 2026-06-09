import { useState, useCallback, useEffect } from 'react';
import { sttAdapter, ttsAdapter } from '@/lib/voice';
import { getProfile, incrementPresenceScore, savePassage } from '@/lib/storage';
import { checkInputSafety, shouldCircuitBreak, SAFE_FALLBACK_RESPONSE } from '@/lib/safety';
import { agentRuntime } from '@/lib/runtime/agentRuntime';
import { assembleGuidanceContext } from '@/lib/guidance/contextAssembler';
import type { GuidanceResult, SavedPassage } from '@/types';

export type AgentMode = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export function useAgentController() {
  const [agentMode, setAgentMode] = useState<AgentMode>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [safetyMessage, setSafetyMessage] = useState('');
  const [voiceMessage, setVoiceMessage] = useState('');
  const [saved, setSaved] = useState(false);
  
  const profile = getProfile();
  const voiceGender = profile?.voiceGender || 'male';

  const [activeContext, setActiveContext] = useState<string | null>(null);

  useEffect(() => {
    ttsAdapter.onStateChange = (state) => {
      if (state === 'speaking') setAgentMode('speaking');
      else if (state === 'loading') setAgentMode('thinking');
      else setAgentMode('idle');
    };
  }, []);

  const evaluateContext = useCallback(() => {
    const ctx = assembleGuidanceContext();
    if (!ctx) {
      setActiveContext('Using: Current conversation only');
      return;
    }
    const notes = [];
    if (ctx.currentDailyTheme) notes.push('Today’s Light');
    if (ctx.recentJournalExcerpts.length > 0) notes.push('Recent journal');
    if (ctx.savedPassageRefs.length > 0) notes.push('Saved passages');
    
    if (notes.length > 0) {
      setActiveContext(`Using: ${notes.join(', ')}`);
    } else {
      setActiveContext('Using: Current conversation only');
    }
  }, []);

  useEffect(() => {
    evaluateContext();
  }, [evaluateContext]);

  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled) return;
    void ttsAdapter.speak(text, voiceGender).catch(() => {
      setVoiceMessage('Voice playback is unavailable right now. You can keep reading below.');
    });
  }, [isSpeechEnabled, voiceGender]);

  const toggleListening = useCallback(async (onFocusComposer?: () => void) => {
    setVoiceMessage('');
    if (isListening) {
      sttAdapter.stopListening();
      setIsListening(false);
      setAgentMode('idle');
      return;
    }
    if (!sttAdapter.isSupported()) {
      setVoiceMessage('Speech recognition is not supported on this device. You can still type your request.');
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
      if (onFocusComposer) requestAnimationFrame(onFocusComposer);
    } catch (error) {
      setVoiceMessage((error as Error).message || 'Microphone unavailable. You can still type your request.');
      setIsListening(false);
      setAgentMode('error');
      setTimeout(() => setAgentMode('idle'), 2000);
    }
  }, [isListening]);

  const toggleSpeech = useCallback(() => {
    if (agentMode === 'speaking') ttsAdapter.stop();
    setIsSpeechEnabled((prev) => !prev);
  }, [agentMode]);

  const handleSave = useCallback(() => {
    if (!result || saved) return;
    const entry: SavedPassage = {
      id: crypto.randomUUID(), passage: result.passage,
      note: result.pastoralFraming, savedAt: new Date().toISOString(),
    };
    savePassage(entry);
    setSaved(true);
  }, [result, saved]);

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;
    setSafetyMessage('');
    setVoiceMessage('');
    setSaved(false);
    ttsAdapter.stop();
    evaluateContext();

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
      const concern = input.trim();
      const guidance = await agentRuntime.runGuidance(concern, profile?.toneStyle || 'balanced');
      setResult(guidance);
      setInput('');
      incrementPresenceScore(4);
      speakText(guidance.pastoralFraming);
    } catch {
      const fallback: GuidanceResult = {
        id: 'fullscreen-fallback',
        concern: input,
        themes: ['peace'],
        passage: SAFE_FALLBACK_RESPONSE.passage,
        pastoralFraming: SAFE_FALLBACK_RESPONSE.message,
        reflectionQuestions: ['What would help you slow down for one minute right now?'],
        prayer: 'Lord, steady my thoughts and keep me near your peace. Amen.',
        createdAt: new Date().toISOString(),
      };
      setSafetyMessage('I had trouble preparing guidance, so I switched to a safe fallback.');
      setResult(fallback);
      setInput('');
      speakText(fallback.pastoralFraming);
    } finally {
      setLoading(false);
      setAgentMode('idle');
    }
  }, [input, profile?.toneStyle, speakText, evaluateContext]);

  const stopSpeaking = useCallback(() => {
    if (agentMode === 'speaking') {
      ttsAdapter.stop();
      setAgentMode('idle');
    }
  }, [agentMode]);

  return {
    agentMode,
    isListening,
    isSpeechEnabled,
    input,
    setInput,
    loading,
    result,
    safetyMessage,
    voiceMessage,
    saved,
    activeContext,
    toggleListening,
    toggleSpeech,
    handleSave,
    handleSubmit,
    stopSpeaking,
    speakText
  };
}
