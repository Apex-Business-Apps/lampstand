import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { AgentPresence } from '@/components/AgentPresence';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff, Volume2, VolumeX, RotateCcw, AlertCircle } from 'lucide-react';
import { useAgentController } from '@/hooks/useAgentController';

export default function GuidancePage() {
  const agent = useAgentController();

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <div className="text-center space-y-2">
          <div
            onClick={() => (agent.agentMode === 'speaking' ? agent.stopSpeaking() : agent.result && agent.speakText(agent.result.pastoralFraming))}
            className="cursor-pointer"
            title={agent.agentMode === 'speaking' ? 'Stop speaking' : 'Read aloud'}
          >
            <AgentPresence size="sm" className="mx-auto" mode={agent.agentMode} />
          </div>
          <h1 className="text-2xl font-serif font-semibold">Guidance</h1>
          <p className="text-sm text-muted-foreground">Share what is on your heart. Scripture appears first, then reflection.</p>
          {agent.activeContext && (
            <p className="text-xs text-muted-foreground">{agent.activeContext}</p>
          )}
        </div>

        <div className="space-y-3">
          <Textarea
            value={agent.input}
            onChange={(e) => agent.setInput(e.target.value)}
            placeholder="What is weighing on you today?"
            className="min-h-[100px] resize-none bg-card"
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                agent.handleSubmit();
              }
            }}
          />

          {agent.safetyMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-primary">{agent.safetyMessage}</p>
            </div>
          )}

          {agent.voiceMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-border bg-card p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{agent.voiceMessage}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => agent.toggleListening()}
              variant={agent.isListening ? 'destructive' : 'outline'}
              className="shrink-0"
              disabled={agent.loading}
              title={agent.isListening ? 'Stop listening' : 'Use microphone'}
            >
              {agent.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={agent.toggleSpeech}
              variant="outline"
              className="shrink-0"
              title={agent.isSpeechEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {agent.isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              onClick={agent.replay}
              variant="outline"
              className="shrink-0"
              disabled={!agent.result}
              title="Replay reflection"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={agent.handleSubmit}
              disabled={agent.loading || !agent.input.trim()}
              className="w-full gap-2"
            >
              <Send className="h-4 w-4" />
              {agent.loading ? 'Finding light...' : 'Seek Guidance'}
            </Button>
          </div>
        </div>

        {agent.result && (
          <div className="space-y-5 animate-slide-up">
            <ScriptureCard passage={agent.result.passage} onSave={agent.handleSave} saved={agent.saved} />
            <ReflectionBlock label="Pastoral Reflection" content={agent.result.pastoralFraming} variant="reflection" />
            {agent.result.reflectionQuestions && agent.result.reflectionQuestions.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sit With These</p>
                <ul className="space-y-1.5">
                  {agent.result.reflectionQuestions.map((q, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="shrink-0 text-primary font-medium">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {agent.result.prayer && <ReflectionBlock label="Prayer" content={agent.result.prayer} variant="prayer" />}
          </div>
        )}
      </div>
    </AppShell>
  );
}
