import { useNavigate } from 'react-router-dom';
import { Baby, Flame, ArrowRight, ChevronRight } from 'lucide-react';
import { OilLampIcon, DoveIcon, ScrollIcon, OpenBookIcon, CandleMoonIcon, DoorLightIcon } from '@/components/brand/SacredIcons';
import { hasCompletedTodayExamen } from '@/lib/examen/examenFlow';
import { hasCompletedTodayLectio } from '@/lib/lectio/lectioFlow';
import { Button } from '@/components/ui/button';
import { AgentPresence } from '@/components/AgentPresence';
import { AppShell } from '@/components/AppShell';
import { getProfile, getKnowledge, getSavedPassages, updateStreak, getPresenceScore } from '@/lib/storage';
import { getDailyLight } from '@/lib/dailyLight';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import type { UserProfile } from '@/types';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const knowledge = getKnowledge();
  const saved = getSavedPassages();
  const presence = getPresenceScore();

  useEffect(() => {
    if (authLoading) return;

    const p = getProfile();
    if (!p || !p.onboardingComplete) {
      navigate('/onboarding', { replace: true });
      return;
    }

    setProfile(p);
    updateStreak();
  }, [authLoading, navigate, user]);

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const today = getDailyLight();
  const greeting = getGreeting(profile.firstName);
  const examenDone = hasCompletedTodayExamen();
  const lectioDone = hasCompletedTodayLectio();
  const isEvening = new Date().getHours() >= 17;
  const isMorning = new Date().getHours() < 12;

  return (
    <AppShell kidsMode={profile.kidsMode}>
      <div className={`px-5 pt-8 pb-6 space-y-7 ${presence.state === 'ember' ? 'opacity-95' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in">
          <div>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-ui)' }}>{greeting}</p>
            <h1 className="mt-0.5 font-display text-[1.75rem] font-semibold leading-none tracking-tight text-foreground">
              The <span className="text-gold-shimmer">Lamp</span> Stand
            </h1>
          </div>
          {knowledge.streak > 0 && (
            <div
              className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--sacred-gold)/0.35)] bg-gradient-to-b from-[hsl(var(--sacred-gold-soft))] to-[hsl(var(--warm-glow-soft))] px-3 py-1.5 shadow-[0_2px_12px_-4px_hsl(var(--warm-glow)/0.5)]"
              title={`${knowledge.streak}-day flame`}
            >
              <Flame className="h-4 w-4 text-[hsl(var(--ember))]" />
              <span className="text-sm font-semibold text-[hsl(var(--ember))]" style={{ fontFamily: 'var(--font-ui)' }}>{knowledge.streak}</span>
            </div>
          )}
        </div>

        {/* Daily Light Hero */}
        <button onClick={() => navigate('/daily')} className="group w-full text-left" aria-label="Read Today's Light">
          <div
            className={`relative overflow-hidden rounded-3xl border border-[hsl(var(--sacred-gold)/0.35)] bg-gradient-to-br from-[hsl(var(--ivory))] via-[hsl(var(--sacred-gold-soft))] to-[hsl(var(--warm-glow-soft))] p-6 space-y-4 shadow-[0_18px_50px_-22px_hsl(var(--warm-glow)/0.55)] transition-all duration-300 animate-slide-up group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_60px_-22px_hsl(var(--warm-glow)/0.7)] ${
              presence.state === 'radiance' || presence.state === 'sacred-heart' ? 'shadow-[0_0_45px_rgba(250,180,80,0.35)]' : ''
            }`}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[hsl(var(--warm-glow)/0.25)] blur-2xl animate-glow-pulse" />
            <div className="relative flex items-center gap-3">
              <AgentPresence size="sm" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[hsl(var(--ember))]" style={{ fontFamily: 'var(--font-ui)' }}>Today's Light</p>
                <p className="text-sm capitalize text-muted-foreground">{today.theme}</p>
              </div>
            </div>
            <p className="scripture-text relative line-clamp-3 text-lg leading-relaxed">{today.passage.text}</p>
            <div className="relative flex items-center justify-between">
              <p className="text-sm font-semibold text-[hsl(var(--ember))]" style={{ fontFamily: 'var(--font-ui)' }}>{today.passage.reference}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary opacity-80 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" style={{ fontFamily: 'var(--font-ui)' }}>
                Read &amp; reflect <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </button>

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <ActionCard icon={OilLampIcon} label="Today's Light" hint="Read & reflect" onClick={() => navigate('/daily')} />
          <ActionCard icon={ScrollIcon} label="Sermon Mode" hint="Listen & learn" onClick={() => navigate('/sermon')} />
          <ActionCard icon={DoveIcon} label="Guidance" hint="Ask anything" onClick={() => navigate('/guidance')} />
          <ActionCard icon={OpenBookIcon} label="Continue Reading" hint="Saved passages" onClick={() => navigate('/saved')} />
        </div>

        {/* Daily practices */}
        <div className="space-y-3">
          <h2 className="px-1 font-display text-lg font-semibold text-foreground">Daily practices</h2>

          <PracticeRow
            icon={LectioIcon}
            done={lectioDone}
            highlight={isMorning && !lectioDone}
            title={lectioDone ? 'Today’s Lectio — Complete' : 'Lectio Divina'}
            subtitle={
              lectioDone
                ? 'The word is with you today.'
                : isMorning
                  ? 'A guided practice for today’s passage.'
                  : 'Read, reflect, pray, rest. A guided practice.'
            }
            ariaLabel="Begin Lectio Divina on today's passage"
            onClick={() => navigate('/lectio')}
          />

          <PracticeRow
            icon={CandleMoonIcon}
            done={examenDone}
            highlight={isEvening && !examenDone}
            title={examenDone ? 'Today’s Examen — Complete' : 'The Daily Examen'}
            subtitle={
              examenDone
                ? 'Rest in the quiet you made tonight.'
                : isEvening
                  ? 'A quiet evening reflection.'
                  : 'A guided evening prayer, ready when you are.'
            }
            ariaLabel="Open the Daily Examen"
            onClick={() => navigate('/examen')}
          />

          <PracticeRow
            icon={DoorLightIcon}
            title="The Return"
            subtitle="Been away? A graceful path back — no guilt."
            ariaLabel="Open The Return"
            onClick={() => navigate('/return')}
          />
        </div>

        {profile.kidsMode && (
          <Button variant="outline" className="w-full gap-2 border-2" onClick={() => navigate('/kids')}>
            <Baby className="h-4 w-4" /> Kids Mode
          </Button>
        )}

        {/* Saved Preview */}
        {saved.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-display text-lg font-semibold text-foreground">Saved Passages</h2>
              <button onClick={() => navigate('/saved')} className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:text-[hsl(var(--ember))]" style={{ fontFamily: 'var(--font-ui)' }}>
                View all <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {saved.slice(0, 2).map(s => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
                  <p className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-ui)' }}>{s.passage.reference}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{s.passage.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/** Lectio's open Bible with light descending on the Word. */
const LectioIcon = ({ className }: { className?: string }) => <OpenBookIcon rays className={className} />;

function ActionCard({ icon: Icon, label, hint, onClick }: { icon: React.ElementType; label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[hsl(var(--sacred-gold)/0.5)] hover:shadow-[0_12px_32px_-14px_hsl(var(--warm-glow)/0.5)]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-[hsl(var(--sacred-gold)/0.3)] transition-transform duration-200 group-hover:scale-110">
        <Icon className="h-8 w-8" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-ui)' }}>{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-ui)' }}>{hint}</span>
      </span>
    </button>
  );
}

function PracticeRow({
  icon: Icon,
  title,
  subtitle,
  ariaLabel,
  onClick,
  done = false,
  highlight = false,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  ariaLabel: string;
  onClick: () => void;
  done?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
        done
          ? 'border-border bg-card opacity-75'
          : highlight
            ? 'border-[hsl(var(--sacred-gold)/0.5)] bg-gradient-to-br from-[hsl(var(--sacred-gold-soft))] to-[hsl(var(--ivory))] shadow-[0_10px_32px_-14px_hsl(var(--warm-glow)/0.55)]'
            : 'border-border bg-card hover:-translate-y-0.5 hover:border-[hsl(var(--sacred-gold)/0.45)] hover:shadow-[0_10px_28px_-14px_hsl(var(--warm-glow)/0.4)]'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] ${
          highlight
            ? 'ring-2 ring-[hsl(var(--sacred-gold)/0.55)] shadow-[0_4px_18px_-4px_hsl(var(--warm-glow)/0.7)]'
            : 'ring-1 ring-[hsl(var(--sacred-gold)/0.3)]'
        }`}>
          <Icon className="h-8 w-8" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-foreground" style={{ fontFamily: 'var(--font-ui)' }}>{title}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-ui)' }}>{subtitle}</span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
      </div>
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
