import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { getDailyLight } from '@/lib/dailyLight';
import { ReflectionBlock } from '@/components/ReflectionBlock';
import { ScriptureCard } from '@/components/ScriptureCard';
import { incrementPresenceScore } from '@/lib/storage';
import { recordSignal } from '@/lib/resonance/ResonanceEngine';

const needs = ['Peace', 'Direction', 'Comfort', 'Strength'];
const timeOptions = ['3 minutes', '7 minutes', '15 minutes'];

const NEED_THEME_MAP: Record<string, string> = {
  Peace: 'peace',
  Direction: 'discernment',
  Comfort: 'consolation',
  Strength: 'perseverance',
};

export default function ReturnPage() {
  const [time, setTime] = useState<string>('7 minutes');
  const [need, setNeed] = useState<string>('Peace');
  const daily = getDailyLight();

  function handleRekindle() {
    incrementPresenceScore(6);
  }

  function handleNeedSelect(selected: string) {
    setNeed(selected);
    try {
      recordSignal({ signal: 'guided', theme: NEED_THEME_MAP[selected] ?? 'peace' });
    } catch { /* best-effort */ }
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
          <div className="flex gap-2 flex-wrap">{needs.map((o) => <Button key={o} size="sm" variant={o === need ? 'default' : 'outline'} onClick={() => handleNeedSelect(o)}>{o}</Button>)}</div>
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
