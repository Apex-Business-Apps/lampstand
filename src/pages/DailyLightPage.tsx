import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { AgentPresence } from '@/components/AgentPresence';
import { Button } from '@/components/ui/button';
import { getDailyLight, getDailyLightWithHistory } from '@/lib/dailyLight';
import { savePassage, getSavedPassages } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import type { DailyLight, SavedPassage } from '@/types';
import { ChevronDown } from 'lucide-react';

export default function DailyLightPage() {
  const { user } = useAuth();
  const [today, setToday] = useState<DailyLight>(() => getDailyLight());
  const [showDeeper, setShowDeeper] = useState(false);
  const [saved, setSaved] = useState(() => getSavedPassages().some(s => s.passage.reference === today.passage.reference));

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    getDailyLightWithHistory(user.id).then(d => {
      if (!cancelled) {
        setToday(d);
        setSaved(getSavedPassages().some(s => s.passage.reference === d.passage.reference));
      }
    });
    return () => { cancelled = true; };
  }, [user?.id]);

  async function handleShare() {
    const shareText = `${today.passage.reference}\n\n${today.passage.text}\n\nReflection: ${today.reflection}`;
    if (navigator.share) {
      await navigator.share({ title: 'LampStand Daily Light', text: shareText });
      return;
    }
    await navigator.clipboard.writeText(shareText);
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
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <div className="text-center space-y-3">
          <AgentPresence size="md" className="mx-auto" />
          <h1 className="text-2xl font-serif font-semibold">Daily Light</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <ScriptureCard passage={today.passage} onSave={handleSave} onShare={handleShare} saved={saved} />

        <ReflectionBlock label="Reflection" content={today.reflection} variant="reflection" />

        <ReflectionBlock label="Prayer" content={today.prayer} variant="prayer" />

        {!showDeeper ? (
          <Button variant="outline" className="w-full gap-2" onClick={() => setShowDeeper(true)}>
            <ChevronDown className="h-4 w-4" /> Reflect Deeper
          </Button>
        ) : (
          <div className="animate-slide-up space-y-4">
            <ReflectionBlock
              label="Going Deeper"
              content="Take a moment with this passage. Read it again slowly. What word or phrase stands out to you? Don't analyze it - just let it sit. Sometimes scripture speaks most clearly when we stop trying to figure it out and simply listen.\n\nConsider: What is this passage inviting you toward today? Not what you should do - but what you're being drawn to."
              variant="reflection"
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
