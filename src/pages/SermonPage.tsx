import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { ScriptureCard } from '@/components/ScriptureCard';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { AgentPresence } from '@/components/AgentPresence';
import { SEED_SERMONS } from '@/data/seed';
import { SEED_PASSAGES } from '@/data/seed';
import { getAIAdapter } from '@/lib/adapters';
import { getProfile } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import type { Sermon } from '@/types';
import { RefreshCw } from 'lucide-react';

export default function SermonPage() {
  const [sermon, setSermon] = useState<Sermon>(SEED_SERMONS[0]);
  const [loading, setLoading] = useState(false);

  async function generateNew() {
    setLoading(true);
    try {
      const profile = getProfile();
      const randomPassage = SEED_PASSAGES[Math.floor(Math.random() * SEED_PASSAGES.length)];
      const ai = getAIAdapter();
      const newSermon = await ai.generateSermon(randomPassage, profile?.toneStyle || 'balanced');
      setSermon(newSermon);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <div className="text-center space-y-2">
          <AgentPresence size="sm" className="mx-auto" />
          <h1 className="text-2xl font-serif font-semibold">Sermon Mode</h1>
          <p className="text-sm text-muted-foreground">A scripture-anchored reflection for your moment</p>
        </div>

        <h2 className="text-xl font-serif font-semibold text-center">{sermon.title}</h2>

        <ScriptureCard passage={sermon.passage} />

        <ReflectionBlock label="Reflection" content={sermon.reflection} variant="reflection" />

        <ReflectionBlock label="Why This Matters Today" content={sermon.relevance} variant="relevance" />

        {sermon.prayer && (
          <ReflectionBlock label="Prayer" content={sermon.prayer} variant="prayer" />
        )}

        <Button variant="outline" className="w-full gap-2" onClick={generateNew} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Preparing...' : 'Another Reflection'}
        </Button>
      </div>
    </AppShell>
  );
}
