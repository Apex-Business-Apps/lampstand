import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { AgentPresence } from '@/components/AgentPresence';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getDailyLight, getDailyLightWithHistory } from '@/lib/dailyLight';
import { savePassage, getSavedPassages, saveJournalEntry } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import type { DailyLight, SavedPassage, JournalEntry } from '@/types';
import {
  ChevronDown,
  Volume2,
  VolumeX,
  Share2,
  Bookmark,
  BookmarkCheck,
  PenLine,
  Check,
  Sparkles,
} from 'lucide-react';
import { recordSignal } from '@/lib/resonance/ResonanceEngine';

export default function DailyLightPage() {
  const { user } = useAuth();
  const [today, setToday] = useState<DailyLight>(() => getDailyLight());
  const [showDeeper, setShowDeeper] = useState(false);
  const [saved, setSaved] = useState(() =>
    getSavedPassages().some((s) => s.passage.reference === today.passage.reference)
  );

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showJournalInput, setShowJournalInput] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    getDailyLightWithHistory(user.id).then((d) => {
      if (!cancelled) {
        setToday(d);
        setSaved(getSavedPassages().some((s) => s.passage.reference === d.passage.reference));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  async function handleShare() {
    const shareText = `TheLampStand Daily Light\n${today.passage.reference}\n"${today.passage.text}"\n\nReflection:\n${today.reflection}\n\nPrayer:\n${today.prayer}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TheLampStand Daily Light', text: shareText });
      } catch {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    recordSignal({ signal: 'shared', passage: today.passage, theme: today.theme });
  }

  function handleSave() {
    if (saved) return;
    const entry: SavedPassage = {
      id: crypto.randomUUID(),
      passage: today.passage,
      savedAt: new Date().toISOString(),
    };
    savePassage(entry);
    setSaved(true);
    recordSignal({ signal: 'saved', passage: today.passage, theme: today.theme });
  }

  function handleDeeper() {
    setShowDeeper(true);
    recordSignal({ signal: 'reflected', passage: today.passage, theme: today.theme });
  }

  function toggleSpeech() {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${today.passage.reference}. ${today.passage.text}. Reflection: ${today.reflection}. Prayer: ${today.prayer}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  function handleSaveJournal() {
    if (!journalNote.trim()) return;
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      content: `[Daily Light: ${today.passage.reference}]\n${journalNote.trim()}`,
      passageId: today.passage.id,
      themes: [today.theme || 'reflection'],
      createdAt: new Date().toISOString(),
    };
    saveJournalEntry(entry);
    setJournalSaved(true);
    recordSignal({ signal: 'journaled', passage: today.passage, theme: today.theme });
    setTimeout(() => {
      setJournalSaved(false);
      setShowJournalInput(false);
      setJournalNote('');
    }, 1500);
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-10 space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <AgentPresence size="md" className="mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">Begin here.</h1>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            {today.theme && (
              <>
                <span>•</span>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-primary capitalize font-medium">
                  {today.theme}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2 backdrop-blur-sm">
          <span className="text-xs text-muted-foreground font-medium">Daily Scripture Meditation</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleSpeech}
              title={isSpeaking ? 'Stop audio' : 'Listen aloud'}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4 text-primary" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleSave}
              title={saved ? 'Bookmarked' : 'Save passage'}
            >
              {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleShare}
              title="Share reading"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Scripture Card */}
        <ScriptureCard passage={today.passage} onSave={handleSave} onShare={handleShare} saved={saved} />

        {/* Reflection Block */}
        <ReflectionBlock label="Morning Reflection" content={today.reflection} variant="reflection" />

        {/* Prayer Block */}
        <ReflectionBlock label="Prayer" content={today.prayer} variant="prayer" />

        {/* Quick Journal Integration */}
        {!showJournalInput ? (
          <Button
            variant="outline"
            className="w-full gap-2 text-xs h-10 border-dashed"
            onClick={() => setShowJournalInput(true)}
          >
            <PenLine className="h-3.5 w-3.5" />
            <span>Write a Quiet Thought on This Passage</span>
          </Button>
        ) : (
          <div className="rounded-xl border border-primary/20 bg-card p-4 space-y-3 animate-slide-up shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <PenLine className="h-3.5 w-3.5 text-primary" />
                Journal Reflection
              </span>
              <button
                onClick={() => setShowJournalInput(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <Textarea
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="What did God bring to your attention in this scripture?"
              className="min-h-[80px] resize-none text-xs bg-background"
            />
            <Button
              onClick={handleSaveJournal}
              disabled={!journalNote.trim() || journalSaved}
              size="sm"
              className="w-full gap-1.5 text-xs"
            >
              {journalSaved ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Saved to Journal
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Save to Personal Journal
                </>
              )}
            </Button>
          </div>
        )}

        {/* Going Deeper Section */}
        {!showDeeper ? (
          <Button variant="ghost" className="w-full gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={handleDeeper}>
            <ChevronDown className="h-3.5 w-3.5" /> Reflect Deeper
          </Button>
        ) : (
          <div className="animate-slide-up space-y-4">
            <ReflectionBlock
              label="Going Deeper"
              content={`Read the passage again slowly. What catches your attention? Don't analyze it, just let it sit.\n\nWhat is this passage inviting you toward today?`}
              variant="reflection"
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
