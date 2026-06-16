import { useEffect, useRef } from 'react';
import { BurningBushCanvas } from './BurningBushCanvas';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Mic, MicOff, Volume2, VolumeX, Minimize2, Send, AlertCircle, Bookmark, Square } from 'lucide-react';
import { useAgentController } from '@/hooks/useAgentController';
import { cn } from '@/lib/utils';
import { audioAnalyzer } from '@/lib/audioAnalyzer';
import { MESSAGE_PATTERNS } from '@/lib/content/messagePatterns';

interface FullscreenAgentProps {
  onMinimize: () => void;
}

export function FullscreenAgent({ onMinimize }: FullscreenAgentProps) {
  const agent = useAgentController();
  const rafRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const intensityRef = useRef(0.15); // Storing locally to push to canvas

  useEffect(() => {
    const poll = () => {
      const amp = audioAnalyzer.getAmplitude();
      if (agent.agentMode === 'speaking') {
        intensityRef.current = Math.max(0.1, amp);
      } else if (agent.agentMode === 'listening') {
        intensityRef.current = 0.3 + Math.sin(Date.now() / 400) * 0.15;
      } else if (agent.agentMode === 'thinking') {
        intensityRef.current = 0.2 + Math.sin(Date.now() / 600) * 0.1;
      } else {
        intensityRef.current = 0.1 + Math.sin(Date.now() / 2000) * 0.05;
      }
      rafRef.current = requestAnimationFrame(poll);
    };
    rafRef.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [agent.agentMode]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [agent.result, agent.safetyMessage]);

  const handleFlameTap = () => {
    if (agent.agentMode === 'speaking') { agent.stopSpeaking(); return; }
    if (agent.result && agent.isSpeechEnabled) { agent.speakText(agent.result.pastoralFraming); return; }
    composerRef.current?.focus();
  };

  const statusLabel = MESSAGE_PATTERNS.agentStates[agent.agentMode] || 'Ready';
  const statusHelp = agent.agentMode === 'speaking'
    ? 'Tap the flame or stop button to pause voice'
    : 'Share one clear thought and receive scripture-first guidance';

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1610] text-[#fef3c7] flex flex-col">
      <div className="relative z-10 flex flex-col h-full min-h-0">
        {/* Header */}
        <header className="shrink-0 border-b border-[#92400e]/25 bg-[#1a1610]/65 px-3 sm:px-4 pb-2 pt-3 sm:pb-3 sm:pt-4 backdrop-blur-sm safe-top">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img
                src="/images/wordmark-logo.png"
                alt="LampStand"
                className="h-6 sm:h-7 w-auto object-contain"
                draggable={false}
              />
              <span className="rounded-full border border-[#92400e]/40 bg-[#92400e]/20 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-[#fde68a]">
                {agent.agentMode}
              </span>
            </div>
            <button
              onClick={onMinimize}
              className="rounded-full border border-[#92400e]/35 bg-[#1a1610]/70 p-1.5 sm:p-2 text-[#fde68a] transition-colors hover:bg-[#1a1610] hover:text-[#fef3c7]"
              title="Switch to mini mode"
              aria-label="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Agent status + quick prompts */}
        <section className="shrink-0 px-3 sm:px-4 pt-3 sm:pt-4">
          <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#92400e]/30 bg-[#1a1610]/65 p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <button
                  onClick={handleFlameTap}
                  className="shrink-0 rounded-full overflow-hidden border border-[#92400e]/35 w-16 h-16 transition-colors hover:border-[#b45309]/65 relative"
                  title={agent.agentMode === 'speaking' ? 'Tap to stop voice' : 'Tap to replay reflection or focus input'}
                  aria-label="Agent presence"
                >
                  <BurningBushCanvas intensity={intensityRef.current} className="w-full h-full" />
                </button>
                <div className="min-w-0">
                  <p className="text-[15px] font-serif italic text-[#fef3c7]">{statusLabel}</p>
                  <p className="mt-0.5 text-[12px] sm:text-[13px] text-[#fde68a]/70 line-clamp-2">{statusHelp}</p>
                  {agent.activeContext && (
                    <p className="mt-1 text-[11px] text-[#fbbf24]/70">{agent.activeContext}</p>
                  )}
                </div>
              </div>
              {agent.agentMode === 'speaking' && (
                <Button
                  onClick={agent.stopSpeaking}
                  size="icon"
                  className="shrink-0 rounded-full h-10 w-10 border border-[#92400e]/40 bg-[#1a1610]/60 text-[#fde68a] hover:bg-[#92400e]/30 hover:text-[#fef3c7]"
                  title="Stop generating"
                >
                  <Square className="h-4 w-4 fill-current" />
                </Button>
              )}
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              {MESSAGE_PATTERNS.quickActions.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { agent.setInput(prompt); requestAnimationFrame(() => composerRef.current?.focus()); }}
                  className="rounded-full border border-[#92400e]/40 bg-[#1a1610]/60 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[12px] sm:text-[13px] text-[#fde68a] transition-colors hover:border-[#b45309]/70 hover:text-[#fef3c7]"
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
            {agent.safetyMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-[#b45309]/35 bg-[#92400e]/20 p-3">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fbbf24]" />
                <p className="text-[13px] text-[#fde68a]">{agent.safetyMessage}</p>
              </div>
            )}

            {agent.voiceMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-[#b45309]/35 bg-[#1a1610]/60 p-3">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fbbf24]" />
                <p className="text-[13px] text-[#fde68a]">{agent.voiceMessage}</p>
              </div>
            )}

            {!agent.result && (
              <div className="rounded-2xl border border-[#92400e]/25 bg-[#1a1610]/55 p-4 sm:p-5">
                <p className="text-[13px] uppercase tracking-[0.18em] text-[#fbbf24]">Conversation Space</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#fde68a]">
                  Your guidance will appear here in a clear sequence: scripture, reflection, questions, then prayer.
                </p>
              </div>
            )}

            {agent.result && (
              <>
                {agent.result.themes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {agent.result.themes.map((t) => (
                      <span key={t} className="rounded-full bg-[#92400e]/30 px-2 py-0.5 text-[11px] font-medium capitalize text-[#fde68a]">{t}</span>
                    ))}
                  </div>
                )}

                <section className="rounded-xl border border-[#92400e]/25 bg-[#92400e]/15 p-3 sm:p-4">
                  <p className="mb-1 text-[13px] font-semibold uppercase tracking-wider text-[#fbbf24]">{agent.result.passage.reference}</p>
                  <p className="font-serif text-[15px] leading-relaxed text-[#fef3c7]">{agent.result.passage.text}</p>
                  <button
                    onClick={agent.handleSave}
                    className={cn(
                      'mt-3 flex items-center gap-1 text-[11px] uppercase tracking-wider transition-colors',
                      agent.saved ? 'text-[#fbbf24]' : 'text-[#fde68a]/70 hover:text-[#fde68a]'
                    )}
                  >
                    <Bookmark className="h-3 w-3" fill={agent.saved ? 'currentColor' : 'none'} />
                    {agent.saved ? 'Saved' : 'Save'}
                  </button>
                </section>

                <section className="rounded-xl border border-[#92400e]/22 bg-[#92400e]/10 p-3 sm:p-4">
                  <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-[#fbbf24]">Pastoral Reflection</p>
                  <p className="text-[15px] leading-relaxed text-[#fde68a]">{agent.result.pastoralFraming}</p>
                </section>

                {agent.result.reflectionQuestions.length > 0 && (
                  <section className="rounded-xl border border-[#92400e]/22 bg-[#92400e]/10 p-3 sm:p-4">
                    <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-[#fbbf24]">Sit With These</p>
                    <ul className="space-y-1.5">
                      {agent.result.reflectionQuestions.map((q, i) => (
                        <li key={i} className="flex gap-2 text-[15px] text-[#fde68a]">
                          <span className="shrink-0 text-[#fbbf24]">{i + 1}.</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {agent.result.prayer && (
                  <section className="rounded-xl border border-[#92400e]/22 bg-[#92400e]/10 p-3 sm:p-4">
                    <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-[#fbbf24]">Prayer</p>
                    <p className="text-[15px] italic leading-relaxed text-[#fde68a]">{agent.result.prayer}</p>
                  </section>
                )}
              </>
            )}
          </div>
        </main>

        {/* Composer - pinned bottom */}
        <section className="shrink-0 border-t border-[#92400e]/30 bg-[#1a1610]/78 px-3 sm:px-4 pb-3 sm:pb-4 pt-2 sm:pt-3 backdrop-blur-md safe-bottom">
          <div className="mx-auto w-full max-w-3xl space-y-2 sm:space-y-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={composerRef}
                value={agent.input}
                onChange={(e) => agent.setInput(e.target.value)}
                placeholder="What's on your heart..."
                className="min-h-[44px] sm:min-h-[52px] max-h-[90px] sm:max-h-[110px] resize-none border-[#92400e]/45 bg-[#1a1610]/70 text-[#fef3c7] placeholder:text-[#fde68a]/45 text-[15px]"
                maxLength={500}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); agent.handleSubmit(); }
                }}
              />
              <Button
                onClick={agent.handleSubmit}
                disabled={agent.loading || !agent.input.trim()}
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
                  variant={agent.isListening ? 'destructive' : 'outline'}
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-[#92400e]/45 bg-[#1a1610]/70 text-[#fde68a] hover:bg-[#1a1610] hover:text-[#fef3c7]"
                  onClick={() => agent.toggleListening(() => composerRef.current?.focus())}
                  title={agent.isListening ? 'Stop listening' : 'Use microphone'}
                >
                  {agent.isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-[#92400e]/45 bg-[#1a1610]/70 text-[#fde68a] hover:bg-[#1a1610] hover:text-[#fef3c7]"
                  onClick={agent.toggleSpeech}
                  title={agent.isSpeechEnabled ? 'Mute voice playback' : 'Enable voice playback'}
                >
                  {agent.isSpeechEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-[#fde68a]/65">
                {agent.loading && <span className="font-serif italic text-[#fbbf24]">{MESSAGE_PATTERNS.agentStates.thinking}</span>}
                <span>{agent.input.length}/500</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
