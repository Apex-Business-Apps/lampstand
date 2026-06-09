import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { getMyCircles, createCircle } from '@/lib/prayerCircles';
import { useAuth } from '@/hooks/useAuth';
import { getProfile } from '@/lib/storage';
import { Users, Plus, KeyRound } from 'lucide-react';
import type { PrayerCircle, PrayerCircleMember } from '@/types';

export default function PrayerCirclesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [circles, setCircles] = useState<{ circle: PrayerCircle, member: PrayerCircleMember }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');

  const profile = getProfile();
  const userId = user?.id || profile?.id || 'guest';
  const displayName = profile?.firstName || 'Friend';

  useEffect(() => {
    loadCircles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadCircles = async () => {
    setLoading(true);
    try {
      const data = await getMyCircles(userId);
      setCircles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCircleName.trim()) return;
    try {
      await createCircle(userId, newCircleName.trim(), displayName);
      setNewCircleName('');
      setShowCreate(false);
      await loadCircles();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <AppShell><div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></AppShell>;

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6 max-w-md mx-auto">
        <header>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Prayer Circles</h1>
          <p className="text-sm text-muted-foreground mt-1">Quiet chapels for shared intentions.</p>
        </header>

        {circles.length === 0 && !showCreate && (
          <div className="bg-surface border border-border rounded-xl p-6 text-center space-y-4 animate-fade-in">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium">Pray with a small circle</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Circles are invite-only, quiet spaces. No public feeds, no likes, no pressure.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Button onClick={() => setShowCreate(true)} className="w-full gap-2">
                <Plus className="h-4 w-4" /> Create a circle
              </Button>
              <Button variant="outline" className="w-full gap-2 text-muted-foreground">
                <KeyRound className="h-4 w-4" /> Enter invite code
              </Button>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4 animate-slide-up">
            <h2 className="text-lg font-serif font-medium">Name your circle</h2>
            <p className="text-xs text-muted-foreground">Only people you invite can see this circle. We only show the first name or initial you choose.</p>
            <input
              type="text"
              placeholder="e.g. Family Prayer"
              value={newCircleName}
              onChange={(e) => setNewCircleName(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={!newCircleName.trim()} className="flex-1">Create</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {circles.length > 0 && (
          <div className="space-y-3">
            {!showCreate && (
               <div className="flex justify-end">
                 <button onClick={() => setShowCreate(true)} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                   <Plus className="h-3 w-3" /> New circle
                 </button>
               </div>
            )}

            {circles.map(({ circle, member }) => (
              <button
                key={circle.id}
                onClick={() => navigate(`/circles/${circle.id}`)}
                className="w-full text-left bg-surface border border-border hover:border-primary/40 hover:bg-surface-elevated rounded-xl p-4 transition-colors motion-soft flex items-center justify-between"
              >
                <div>
                  <h3 className="text-base font-serif font-medium flex items-center gap-2">
                    {circle.name}
                    {member.role === 'owner' && <span className="text-[10px] uppercase tracking-wider bg-accent px-1.5 py-0.5 rounded text-foreground font-sans">Owner</span>}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Tap to enter</p>
                </div>
                <Users className="h-4 w-4 text-muted-foreground/50" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
