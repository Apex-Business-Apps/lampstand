import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { getCircleDetails, shareIntention } from '@/lib/prayerCircles';
import { useAuth } from '@/hooks/useAuth';
import { getProfile } from '@/lib/storage';
import { ArrowLeft, Users, Send } from 'lucide-react';
import type { PrayerCircle, PrayerCircleMember, PrayerIntention } from '@/types';

export default function PrayerCircleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState<{ circle: PrayerCircle, members: PrayerCircleMember[], intentions: PrayerIntention[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [prayingFor, setPrayingFor] = useState<Record<string, boolean>>({});

  const profile = getProfile();
  const userId = user?.id || profile?.id || 'guest';

  useEffect(() => {
    if (id) loadData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async (circleId: string) => {
    try {
      const details = await getCircleDetails(circleId);
      setData(details);
    } catch (e) {
      console.error(e);
      navigate('/circles');
    } finally {
      setLoading(false);
    }
  };

  const myMember = data?.members.find(m => m.userId === userId);

  const handleSubmit = async () => {
    if (!newTitle.trim() || !data || !myMember) return;
    try {
      await shareIntention(data.circle.id, myMember.userId, newTitle.trim(), newBody.trim() || undefined);
      setNewTitle('');
      setNewBody('');
      setShowForm(false);
      await loadData(data.circle.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <AppShell><div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></AppShell>;
  if (!data) return null;

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-20 space-y-6 max-w-md mx-auto">
        <header className="flex items-center gap-3 border-b border-border/50 pb-4">
          <button onClick={() => navigate('/circles')} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-surface-elevated">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-serif font-semibold text-foreground">{data.circle.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{data.members.length} members</span>
              <span className="opacity-50 mx-1">•</span>
              <div className="flex gap-1">
                {data.members.slice(0, 5).map(m => (
                  <span key={m.userId} className="w-4 h-4 bg-surface-muted rounded-full flex items-center justify-center text-[8px] font-medium border border-border uppercase" title={m.displayName}>
                    {m.displayName.charAt(0)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-4">
          {data.intentions.length === 0 ? (
            <div className="text-center p-8 bg-surface border border-border/50 rounded-xl">
              <p className="text-sm text-muted-foreground">It's quiet in here.</p>
              <p className="text-xs text-muted-foreground mt-1">Be the first to share an intention.</p>
            </div>
          ) : (
            data.intentions.map(i => {
              const author = data.members.find(m => m.userId === i.authorMemberId);
              const authorName = author?.displayName || 'Someone';
              const initial = authorName.charAt(0).toUpperCase();

              return (
                <div key={i.id} className="bg-surface border border-border rounded-xl p-5 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-medium text-accent-foreground uppercase">{initial}</span>
                    <span className="text-sm font-medium text-foreground">{authorName}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{new Date(i.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-serif font-medium">{i.title}</h3>
                  {i.body && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{i.body}</p>}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setPrayingFor(prev => ({ ...prev, [i.id]: true }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all motion-soft ${prayingFor[i.id] ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-transparent border-border text-muted-foreground hover:bg-surface-elevated'}`}
                    >
                      {prayingFor[i.id] ? 'Praying with you' : 'Pray for this'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* Floating Action Button / Sheet */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none z-10 flex flex-col items-center pb-safe">
        <div className="w-full max-w-md mx-auto pointer-events-auto">
          {showForm ? (
            <div className="bg-surface border border-border shadow-lg rounded-2xl p-4 animate-slide-up">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold">Share an intention</h3>
                <button onClick={() => setShowForm(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="What can we pray for? (Short title)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
                  autoFocus
                />
                <textarea
                  placeholder="Additional context (optional)"
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary resize-none h-20"
                />
                <Button onClick={handleSubmit} disabled={!newTitle.trim()} className="w-full gap-2">
                  <Send className="h-4 w-4" /> Share with circle
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowForm(true)} className="w-full shadow-md rounded-full font-medium" size="lg">
              Share what we can pray for
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
