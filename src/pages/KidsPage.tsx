import { AppShell } from '@/components/AppShell';
import { AgentPresence } from '@/components/AgentPresence';
import { SEED_PASSAGES } from '@/data/seed';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Star, RefreshCw } from 'lucide-react';

const KIDS_STORIES = [
  {
    passage: SEED_PASSAGES[1], // Psalm 23
    story: "Imagine someone who cares about you more than anyone - like the best friend and protector you could ever have. That's what this psalm is about. God is like a shepherd who makes sure you have everything you need. When you feel scared or alone, remember: you're never really alone. Someone is always watching over you.",
    activity: "Draw a picture of your favorite safe place. That's where God meets you!",
  },
  {
    passage: SEED_PASSAGES[11], // Matt 5:14-16
    story: "Did you know that YOU are like a light? Not a flashlight or a lamp - but a special kind of light that comes from being kind, being brave, and being yourself. When you help someone, share, or smile at a friend - that's your light shining! And the cool thing is, no one can turn your light off except you.",
    activity: "Think of one kind thing you can do today. That's you being a light!",
  },
  {
    passage: SEED_PASSAGES[2], // Matt 11:28-30
    story: "Have you ever felt really tired - not just sleepy, but tired from worrying or trying really hard? Jesus says something beautiful here: 'Come to me, and I'll give you rest.' It's like getting the biggest, warmest hug when you need it most. You don't have to be perfect. You just have to show up.",
    activity: "Close your eyes, take three deep breaths, and imagine being wrapped in the warmest blanket ever. That's rest.",
  },
];

export default function KidsPage() {
  const [storyIndex, setStoryIndex] = useState(0);
  const current = KIDS_STORIES[storyIndex];

  function nextStory() {
    setStoryIndex((storyIndex + 1) % KIDS_STORIES.length);
  }

  return (
    <AppShell kidsMode>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center gap-2">
            <Star className="h-6 w-6 text-sacred-gold animate-glow-pulse" />
            <Sparkles className="h-6 w-6 text-primary" />
            <Heart className="h-6 w-6 text-ember" />
          </div>
          <h1 className="text-2xl font-serif font-semibold">Kids Corner</h1>
          <p className="text-sm text-muted-foreground">Stories and adventures from the Bible!</p>
        </div>

        <div className="glow-card rounded-2xl p-6 space-y-4 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Today's Story</p>
          <p className="scripture-text text-base">{current.passage.text}</p>
          <p className="text-xs text-muted-foreground">- {current.passage.reference}</p>
        </div>

        <div className="rounded-xl bg-secondary/50 p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-sacred-gold">What does this mean?</p>
          <p className="text-sm text-foreground leading-relaxed">{current.story}</p>
        </div>

        <div className="rounded-xl bg-accent/40 p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-sage">Try This!</p>
          <p className="text-sm text-foreground leading-relaxed">{current.activity}</p>
        </div>

        <Button variant="outline" className="w-full gap-2" onClick={nextStory}>
          <RefreshCw className="h-4 w-4" /> Another Story!
        </Button>
      </div>
    </AppShell>
  );
}
