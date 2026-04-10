import { useState, useCallback, useEffect, useMemo } from 'react';
import { AgentPresence } from './AgentPresence';
import { FullscreenAgent } from './FullscreenAgent';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, VolumeX, X, Maximize2 } from 'lucide-react';
import { sttAdapter, ttsAdapter } from '@/lib/voice';
import { getProfile } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import type { AgentMode } from './AgentPresence';
import type { VoiceGender } from '@/lib/voice';

type ViewMode = 'fullscreen' | 'mini-collapsed' | 'mini-expanded';

const HIDDEN_PATHS = [
  '/onboarding', '/auth', '/legal', '/legal/privacy', '/legal/terms',
  '/legal/acceptable-use', '/legal/disclaimer', '/legal/company',
];

export function FloatingAgent() {
  const [viewMode, setViewMode] = useState<ViewMode>('mini-collapsed');
  const [agentMode, setAgentMode] = useState<AgentMode>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [lastText, setLastText] = useState('');
  const location = useLocation();

  const profile = useMemo(() => getProfile(), []);
  const voiceGender: VoiceGender = profile?.voiceGender || 'male';

  useEffect(() => {
    ttsAdapter.onStateChange = (state) => {
      if (state === 'speaking') setAgentMode('speaking');
      else if (state === 'loading') setAgentMode('thinking');
      else setAgentMode('idle');
    };
  }, []);

  // On /guidance, allow fullscreen. On other paths, collapse.
  useEffect(() => {
    if (viewMode === 'fullscreen' && location.pathname !== '/guidance') {
      setViewMode('mini-collapsed');
    }
  }, [location.pathname, viewMode]);

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

  const handleAgentTap = useCallback(() => {
    if (agentMode === 'speaking') {
      ttsAdapter.stop();
    } else if (lastText && isSpeechEnabled) {
      ttsAdapter.speak(lastText, voiceGender);
    }
  }, [agentMode, lastText, isSpeechEnabled, voiceGender]);

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  // Fullscreen mode
  if (viewMode === 'fullscreen') {
    return <FullscreenAgent onMinimize={() => setViewMode('mini-collapsed')} />;
  }

  // Mini collapsed — small flame button
  if (viewMode === 'mini-collapsed') {
    return (
      <button
        onClick={() => setViewMode('mini-expanded')}
        className={cn(
          'fixed bottom-20 right-4 z-[60] rounded-full shadow-lg',
          'bg-card/95 backdrop-blur-md border border-border',
          'p-1.5 transition-all duration-300 hover:scale-105',
          'active:scale-95'
        )}
        title="Open companion"
      >
        <AgentPresence size="sm" mode={agentMode} />
      </button>
    );
  }

  // Mini expanded — widget with controls
  return (
    <div className={cn(
      'fixed bottom-20 right-4 z-[60]',
      'bg-card/95 backdrop-blur-md border border-border',
      'rounded-2xl shadow-xl p-4 w-56',
      'animate-fade-in'
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground">Companion</span>
        <div className="flex gap-1">
          <button onClick={() => setViewMode('fullscreen')} className="text-muted-foreground hover:text-foreground p-0.5" title="Fullscreen mode">
            <Maximize2 className="h-3 w-3" />
          </button>
          <button onClick={() => setViewMode('mini-collapsed')} className="text-muted-foreground hover:text-foreground p-0.5">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <button onClick={handleAgentTap} className="cursor-pointer" title={agentMode === 'speaking' ? 'Stop' : 'Tap to speak'}>
          <AgentPresence size="sm" mode={agentMode} />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        <Button variant={isListening ? 'destructive' : 'outline'} size="icon" className="h-8 w-8" onClick={toggleListening} title={isListening ? 'Stop listening' : 'Speak'}>
          {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleSpeech} title={isSpeechEnabled ? 'Mute voice' : 'Enable voice'}>
          {isSpeechEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setViewMode('fullscreen')} title="Fullscreen agent">
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground mt-2 capitalize">
        {agentMode === 'idle' ? 'Ready' : agentMode}
      </p>
    </div>
  );
}
