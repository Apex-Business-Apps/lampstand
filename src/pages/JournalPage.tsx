import { useState, useMemo, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Button } from '@/components/ui/button';
import { saveJournalEntry, getJournalEntries, removeJournalEntry } from '@/lib/storage';
import { getDailyLight } from '@/lib/dailyLight';
import { recordSignal } from '@/lib/resonance/ResonanceEngine';
import type { JournalEntry } from '@/types';
import { PenLine, Trash2, Mic, Square, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalSTT } from '@/hooks/useLocalSTT';

type MoodOption = 'grateful' | 'struggling' | 'peaceful' | 'seeking';

const MOOD_LABELS: Record<MoodOption, string> = {
  grateful: 'Grateful',
  struggling: 'Struggling',
  peaceful: 'Peaceful',
  seeking: 'Seeking',
};

const MOOD_THEME_MAP: Record<MoodOption, string> = {
  grateful: 'gratitude',
  struggling: 'consolation',
  peaceful: 'stillness',
  seeking: 'discernment',
};

export default function JournalPage() {
  const navigate = useNavigate();
  const today = useMemo(() => getDailyLight(), []);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [linkPassage, setLinkPassage] = useState(false);
  const [entries, setEntries] = useState(getJournalEntries);

  const { isReady, isDownloading, isRecording, isProcessing, transcript, error, startRecording, stopRecording, clearTranscript } = useLocalSTT();

  useEffect(() => {
    if (transcript) {
      setContent(prev => (prev ? prev + ' ' + transcript : transcript));
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  async function handleSave() {
    if (!content.trim()) return;
    
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) { /* ignore */ }

    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      content: content.trim(),
      mood: selectedMood ?? undefined,
      relatedPassage: linkPassage ? today.passage : undefined,
      createdAt: new Date().toISOString(),
    };
    saveJournalEntry(entry);

    // Feed the ResonanceEngine so the fingerprint learns from journal signals.
    try {
      recordSignal({
        signal: 'reflected',
        passage: linkPassage ? today.passage : undefined,
        theme: selectedMood ? MOOD_THEME_MAP[selectedMood] : today.theme,
      });
    } catch (e) { /* best-effort */ }

    setContent('');
    setSelectedMood(null);
    setLinkPassage(false);
    setEntries(getJournalEntries());
  }

  async function handleDelete(id: string) {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) { /* ignore */ }
    removeJournalEntry(id);
    setEntries(getJournalEntries());
  }

  return (
    <AppShell>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="px-5 pt-8 pb-6 space-y-6"
      >
        <h1 className="text-2xl font-serif font-semibold">Journal</h1>
        <p className="text-sm text-muted-foreground">
          A private space for your thoughts, reflections, and prayers. Everything stays on your device.
        </p>

        <div className="space-y-3">
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write what's on your heart..."
              className="min-h-[120px] resize-none bg-card pb-12"
              maxLength={2000}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {error && <span className="text-xs text-destructive max-w-[200px] truncate">{error}</span>}
              {isDownloading && !isReady && <span className="text-xs text-muted-foreground">Downloading STT model...</span>}
              <Button
                size="icon"
                variant={isRecording ? "destructive" : "secondary"}
                className={`h-8 w-8 rounded-full transition-all ${isRecording ? 'animate-pulse' : ''}`}
                disabled={(!isReady && !isDownloading) || isProcessing}
                onClick={isRecording ? stopRecording : startRecording}
                title={!isReady && !isDownloading ? "Initializing STT..." : isRecording ? "Stop Dictation" : "Start Dictation"}
              >
                {isProcessing || isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Optional mood selection */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">How are you feeling? (optional)</p>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(MOOD_LABELS) as MoodOption[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMood((prev) => (prev === m ? null : m))}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedMood === m
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {MOOD_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Optional passage link */}
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground select-none">
            <input
              type="checkbox"
              checked={linkPassage}
              onChange={(e) => setLinkPassage(e.target.checked)}
              className="rounded border-border"
            />
            Link to today's passage ({today.passage.reference})
          </label>

          <Button onClick={handleSave} disabled={!content.trim()} className="w-full gap-2">
            <PenLine className="h-4 w-4" /> Save Entry
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {entries.map((e) => (
              <motion.div 
                key={e.id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-card rounded-xl p-5 border border-border"
              >
                <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{e.content}</p>
                  {e.relatedPassage && (
                    <p className="text-xs text-primary mt-2">{e.relatedPassage.reference}</p>
                  )}
                  {e.mood && !['examen', 'lectio'].includes(e.mood) && (
                    <p className="text-xs text-muted-foreground/70 mt-1 capitalize">{e.mood}</p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(e.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  aria-label="Delete journal entry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </AppShell>
  );
}
