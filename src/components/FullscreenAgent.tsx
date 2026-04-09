import { useState, useEffect, useCallback, useRef } from 'react';
import { BurningBushCanvas } from './BurningBushCanvas';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, VolumeX, X, MessageCircle, Minimize2 } from 'lucide-react';
import { sttAdapter, ttsAdapter } from '@/lib/voice';
import { audioAnalyzer } from '@/lib/audioAnalyzer';
import { getProfile } from '@/lib/storage';
import { cn } from '@/lib/utils';
import type { AgentMode } from './AgentPresence';
import type { VoiceGender } from '@/lib/voice';

interface FullscreenAgentProps {
  onClose: () => void;
}

export function FullscreenAgent({ onClose }: FullscreenAgentProps) {
  const [agentMode, setAgentMode] = useState<AgentMode>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [intensity, setIntensity] = useState(0.15);
  const [lastText, setLastText] = useState('');
  const rafRef = useRef<number>(0);

  const profile = getProfile();
  const voiceGender: VoiceGender = profile?.voiceGender || 'male';

  // Sync TTS state
  useEffect(() => {
    ttsAdapter.onStateChange = (state) => {
      if (state === 'speaking') setAgentMode('speaking');
      else if (state === 'loading') setAgentMode('thinking');
      else setAgentMode('idle');
    };
  }, []);

  // Audio amplitude polling loop
  useEffect(() => {
    const poll = () => {
      const amp = audioAnalyzer.getAmplitude();
      // Smooth idle pulse when not speaking
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
        setLastText(text);
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
    } else if (lastText && isSpeechEnabled) {
      ttsAdapter.speak(lastText, voiceGender);
    }
  }, [agentMode, lastText, isSpeechEnabled, voiceGender]);

  const statusLabel = agentMode === 'idle' ? 'Be still and know…'
    : agentMode === 'listening' ? 'Listening…'
    : agentMode === 'thinking' ? 'Reflecting…'
    : agentMode === 'speaking' ? 'Speaking…'
    : agentMode === 'error' ? 'Something went wrong'
    : 'Ready';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0805]">
      {/* Burning Bush Canvas — fills screen */}
      <div className="absolute inset-0">
        <BurningBushCanvas intensity={intensity} className="w-full h-full" />
      </div>

      {/* Close / minimize */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-colors"
        title="Exit fullscreen"
      >
        <Minimize2 className="h-5 w-5" />
      </button>

      {/* Tap flame area */}
      <button
        onClick={handleFlameTap}
        className="relative z-10 w-48 h-48 rounded-full cursor-pointer"
        title={agentMode === 'speaking' ? 'Tap to stop' : 'Tap to speak'}
        aria-label="Agent flame"
      />

      {/* Status text */}
      <p className={cn(
        'relative z-10 mt-4 text-sm font-serif italic tracking-wide transition-opacity duration-700',
        agentMode === 'idle' ? 'text-amber-200/60' : 'text-amber-100/90'
      )}>
        {statusLabel}
      </p>

      {/* Controls */}
      <div className="relative z-10 flex gap-3 mt-8">
        <Button
          variant={isListening ? 'destructive' : 'outline'}
          size="icon"
          className="h-11 w-11 rounded-full bg-black/40 border-amber-800/30 text-amber-200 hover:bg-black/60 hover:text-amber-100"
          onClick={toggleListening}
          title={isListening ? 'Stop listening' : 'Speak to the flame'}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full bg-black/40 border-amber-800/30 text-amber-200 hover:bg-black/60 hover:text-amber-100"
          onClick={toggleSpeech}
          title={isSpeechEnabled ? 'Mute voice' : 'Enable voice'}
        >
          {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full bg-black/40 border-amber-800/30 text-amber-200 hover:bg-black/60 hover:text-amber-100"
          onClick={() => { onClose(); window.location.href = '/guidance'; }}
          title="Open Guidance"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
