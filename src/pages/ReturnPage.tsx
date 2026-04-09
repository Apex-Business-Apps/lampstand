import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { SEED_DAILY_LIGHTS } from '@/data/seed';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { ScriptureCard } from '@/components/ScriptureCard';
import { incrementPresenceScore } from '@/lib/storage';

const needs = ['Peace', 'Direction', 'Comfort', 'Strength'];
const timeOptions = ['3 minutes', '7 minutes', '15 minutes'];

export default function ReturnPage() {
  const [time, setTime] = useState<string>('7 minutes');
  const [need, setNeed] = useState<string>('Peace');
  const daily = SEED_DAILY_LIGHTS[0];

  function handleRekindle() {
    incrementPresenceScore(6);
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground">The light is still here. Start from where you are today.</p>
        <section className="space-y-3">
          <p className="text-sm">How much time do you have?</p>
          <div className="flex gap-2 flex-wrap">{timeOptions.map((o) => <Button key={o} size="sm" variant={o === time ? 'default' : 'outline'} onClick={() => setTime(o)}>{o}</Button>)}</div>
          <p className="text-sm">What do you need right now?</p>
          <div className="flex gap-2 flex-wrap">{needs.map((o) => <Button key={o} size="sm" variant={o === need ? 'default' : 'outline'} onClick={() => setNeed(o)}>{o}</Button>)}</div>
        </section>

        <ScriptureCard passage={daily.passage} />
        <ReflectionBlock label="Short Reflection" content={`In ${time}, stay with one clear need: ${need}. Read slowly. Keep one phrase with you through the day.`} variant="reflection" />
        <ReflectionBlock label="Prayer" content="Lord, meet me where I am. Rekindle what has grown quiet, and guide my next step in peace. Amen." variant="prayer" />
        <ReflectionBlock label="One next step" content="Open LampStand again tonight for a one-minute check-in." variant="reflection" />
        <Button onClick={handleRekindle} className="w-full">Rekindle today</Button>
      </div>
    </AppShell>
  );
}
