import { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { AgentPresence } from '@/components/AgentPresence';
import { CONTENT_PASSAGES } from '@/data/contentLibrary';
import { buildGroundedSermon } from '@/data/sermonLibrary';
import { getProfile, savePassage, getSavedPassages } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { getSecureRandomInt } from '@/lib/utils';
import type { Sermon, ToneStyle, SavedPassage, ScripturePassage } from '@/types';
import {
  RefreshCw,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  Share2,
  Search,
  Check,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { recordSignal } from '@/lib/resonance/ResonanceEngine';

const THEME_CATEGORIES: { id: string; label: string; keywords: string[] }[] = [
  { id: 'all', label: 'All Sermons', keywords: [] },
  { id: 'peace', label: 'Peace & Rest', keywords: ['peace', 'rest', 'stillness', 'calm', 'quiet', 'troubled'] },
  { id: 'comfort', label: 'Comfort & Hope', keywords: ['comfort', 'hope', 'grief', 'tears', 'depths', 'heals'] },
  { id: 'strength', label: 'Courage & Strength', keywords: ['strength', 'courage', 'power', 'fear', 'boldness', 'weakness'] },
  { id: 'wisdom', label: 'Wisdom & Light', keywords: ['wisdom', 'light', 'path', 'lamp', 'guide', 'discernment'] },
  { id: 'grace', label: 'Grace & Love', keywords: ['grace', 'love', 'mercy', 'forgive', 'shepherd', 'portion'] },
  { id: 'renewal', label: 'Renewal & Purpose', keywords: ['renewal', 'creation', 'fruit', 'handiwork', 'future', 'alive'] },
];

export default function SermonPage() {
  const [profileTone, setProfileTone] = useState<ToneStyle>(() => getProfile()?.toneStyle || 'balanced');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const [currentPassage, setCurrentPassage] = useState<ScripturePassage>(() => CONTENT_PASSAGES[0]);
  const [sermon, setSermon] = useState<Sermon>(() => buildGroundedSermon(CONTENT_PASSAGES[0], profileTone));
  const [loading, setLoading] = useState(false);

  const [saved, setSaved] = useState(() =>
    getSavedPassages().some((s) => s.passage?.reference === CONTENT_PASSAGES[0].reference)
  );

  // Update sermon whenever passage or tone changes
  useEffect(() => {
    const updated = buildGroundedSermon(currentPassage, profileTone);
    setSermon(updated);
    setSaved(getSavedPassages().some((s) => s.passage?.reference === currentPassage.reference));
  }, [currentPassage, profileTone]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const filteredPassages = useMemo(() => {
    return CONTENT_PASSAGES.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.book.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedTheme === 'all') return true;

      const category = THEME_CATEGORIES.find((c) => c.id === selectedTheme);
      if (!category) return true;

      const combined = `${p.reference} ${p.text} ${p.book}`.toLowerCase();
      return category.keywords.some((k) => combined.includes(k));
    });
  }, [searchQuery, selectedTheme]);

  function handlePassageSelect(passage: ScripturePassage) {
    setCurrentPassage(passage);
    setShowSelector(false);
    try {
      recordSignal({ signal: 'reflected', passage });
    } catch { /* best-effort */ }
  }

  function handleRandomPassage() {
    setLoading(true);
    try {
      const pool = filteredPassages.length > 0 ? filteredPassages : CONTENT_PASSAGES;
      const nextPassage = pool[getSecureRandomInt(pool.length)];
      setCurrentPassage(nextPassage);
      try {
        recordSignal({ signal: 'reflected', passage: nextPassage });
      } catch { /* best-effort */ }
    } finally {
      setLoading(false);
    }
  }

  function handleToneChange(tone: ToneStyle) {
    setProfileTone(tone);
    try {
      recordSignal({ signal: 'reflected', passage: currentPassage });
    } catch { /* best-effort */ }
  }

  function handleSave() {
    if (saved) return;
    const entry: SavedPassage = {
      id: crypto.randomUUID(),
      passage: currentPassage,
      savedAt: new Date().toISOString(),
    };
    savePassage(entry);
    setSaved(true);
    recordSignal({ signal: 'saved', passage: currentPassage });
  }

  async function handleShare() {
    const text = `${sermon.title}\n\n${sermon.passage.reference}\n"${sermon.passage.text}"\n\nReflection:\n${sermon.reflection}\n\nWhy This Matters Today:\n${sermon.relevance}\n\nPrayer:\n${sermon.prayer}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: sermon.title, text });
      } catch {
        // Fallback to clipboard
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    recordSignal({ signal: 'shared', passage: currentPassage });
  }

  function toggleSpeech() {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${sermon.title}. ${sermon.passage.reference}. ${sermon.passage.text}. Reflection: ${sermon.reflection}. Why this matters today: ${sermon.relevance}. Prayer: ${sermon.prayer}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-10 space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <AgentPresence size="sm" className="mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">Sermon Mode</h1>
          <p className="text-sm text-muted-foreground">Expositional depth and scripture-anchored reflection</p>
        </div>

        {/* Thematic Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedTheme(cat.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedTheme === cat.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Action Controls: Passage Search/Select, Tone Toggle, Audio & Share */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border/60 bg-card/60 p-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <Button
              variant={showSelector ? 'secondary' : 'outline'}
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={() => setShowSelector(!showSelector)}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Browse ({filteredPassages.length})</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={handleRandomPassage}
              disabled={loading}
              title="Explore another reflection"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Random</span>
            </Button>
          </div>

          {/* Tone Selector Pills */}
          <div className="flex items-center gap-1 rounded-lg bg-secondary/80 p-0.5 text-xs">
            {(['gentle', 'balanced', 'traditional'] as ToneStyle[]).map((t) => (
              <button
                key={t}
                onClick={() => handleToneChange(t)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
                  profileTone === t
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleSpeech}
              title={isSpeaking ? 'Pause reading' : 'Read sermon aloud'}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4 text-primary" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleSave}
              title={saved ? 'Passage bookmarked' : 'Save passage'}
            >
              {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleShare}
              title="Copy or share sermon"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Dropdown / Accordion Passage Selector */}
        {showSelector && (
          <div className="rounded-xl border border-primary/20 bg-card p-4 space-y-3 animate-slide-up shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scripture by reference or keyword..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {filteredPassages.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No scripture passages found matching query.</p>
              ) : (
                filteredPassages.map((p) => {
                  const isSelected = p.id === currentPassage.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePassageSelect(p)}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'hover:bg-secondary/60 text-foreground'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold">{p.reference}</span>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{p.text}</p>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Sermon Title */}
        <div className="text-center pt-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
            {sermon.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 capitalize font-medium">
            Tone: {profileTone} mode
          </p>
        </div>

        {/* Scripture Card */}
        <ScriptureCard passage={sermon.passage} onSave={handleSave} onShare={handleShare} saved={saved} />

        {/* Reflection Blocks */}
        <ReflectionBlock label="Exposition & Reflection" content={sermon.reflection} variant="reflection" />

        <ReflectionBlock label="Why This Matters Today" content={sermon.relevance} variant="relevance" />

        {sermon.prayer && (
          <ReflectionBlock label="Pastoral Prayer" content={sermon.prayer} variant="prayer" />
        )}

        {/* Footer Navigation */}
        <div className="pt-2">
          <Button variant="outline" className="w-full gap-2 py-5" onClick={handleRandomPassage} disabled={loading}>
            <Sparkles className={`h-4 w-4 ${loading ? 'animate-spin' : 'text-primary'}`} />
            {loading ? 'Preparing next reflection...' : 'Reflect on Another Scripture'}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
