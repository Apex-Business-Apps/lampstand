import { useNavigate } from 'react-router-dom';
import { Sun, BookOpen, MessageCircle, PlayCircle, Baby, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentPresence } from '@/components/AgentPresence';
import { AppShell } from '@/components/AppShell';
import { getProfile, getKnowledge, getSavedPassages, updateStreak } from '@/lib/storage';
import { SEED_DAILY_LIGHTS } from '@/data/seed';
import { useEffect, useState } from 'react';
import type { UserProfile } from '@/types';

export default function HomePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const knowledge = getKnowledge();
  const saved = getSavedPassages();

  useEffect(() => {
    const p = getProfile();
    if (!p || !p.onboardingComplete) { navigate('/onboarding'); return; }
    setProfile(p);
    updateStreak();
  }, [navigate]);

  if (!profile) return null;

  const today = SEED_DAILY_LIGHTS[0];
  const greeting = getGreeting(profile.firstName);

  return (
    <AppShell kidsMode={profile.kidsMode}>
      <div className="px-5 pt-8 pb-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{greeting}</p>
            <h1 className="text-2xl font-serif font-semibold text-foreground">LampStand</h1>
          </div>
          {knowledge.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-accent/60 px-3 py-1.5 rounded-full">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{knowledge.streak}</span>
            </div>
          )}
        </div>

        {/* Daily Light Hero */}
        <button onClick={() => navigate('/daily')} className="w-full text-left">
          <div className="glow-card rounded-2xl p-6 space-y-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <AgentPresence size="sm"  />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Today's Light</p>
                <p className="text-sm text-muted-foreground">{today.theme}</p>
              </div>
            </div>
            <p className="scripture-text text-base line-clamp-3">{today.passage.text}</p>
            <p className="text-xs text-muted-foreground">- {today.passage.reference}</p>
          </div>
        </button>

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <ActionCard icon={Sun} label="Read Today's Light" onClick={() => navigate('/daily')} />
          <ActionCard icon={PlayCircle} label="Sermon Mode" onClick={() => navigate('/sermon')} />
          <ActionCard icon={MessageCircle} label="Ask for Guidance" onClick={() => navigate('/guidance')} />
          <ActionCard icon={BookOpen} label="Continue Reading" onClick={() => navigate('/saved')} />
        </div>

        {profile.kidsMode && (
          <Button variant="outline" className="w-full gap-2 border-2" onClick={() => navigate('/kids')}>
            <Baby className="h-4 w-4" /> Kids Mode
          </Button>
        )}

        {/* Saved Preview */}
        {saved.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-serif font-semibold">Saved Passages</h2>
              <button onClick={() => navigate('/saved')} className="text-xs text-primary font-medium">View all</button>
            </div>
            <div className="space-y-2">
              {saved.slice(0, 2).map(s => (
                <div key={s.id} className="bg-card rounded-lg p-4 border border-border">
                  <p className="text-sm font-medium text-foreground">{s.passage.reference}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{s.passage.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ActionCard({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 bg-card rounded-xl p-4 border border-border hover:border-primary/40 transition-all text-center"
    >
      <Icon className="h-6 w-6 text-primary" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  );
}

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const n = name ? `, ${name}` : '';
  if (hour < 12) return `Good morning${n}`;
  if (hour < 17) return `Good afternoon${n}`;
  return `Good evening${n}`;
}
