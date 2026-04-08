import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { getSavedPassages, removePassage, getJournalEntries } from '@/lib/storage';
import { Bookmark, BookOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { SavedPassage } from '@/types';

export default function SavedPage() {
  const navigate = useNavigate();
  const [passages, setPassages] = useState(getSavedPassages);
  const [tab, setTab] = useState<'saved' | 'journal'>('saved');
  const journal = getJournalEntries();

  function handleRemove(id: string) {
    removePassage(id);
    setPassages(getSavedPassages());
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <h1 className="text-2xl font-serif font-semibold">Library</h1>

        <div className="flex gap-2">
          <Button variant={tab === 'saved' ? 'default' : 'outline'} size="sm" onClick={() => setTab('saved')} className="gap-1.5">
            <Bookmark className="h-3.5 w-3.5" /> Saved
          </Button>
          <Button variant={tab === 'journal' ? 'default' : 'outline'} size="sm" onClick={() => setTab('journal')} className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> Journal
          </Button>
        </div>

        {tab === 'saved' && (
          <div className="space-y-3">
            {passages.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Bookmark className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">No saved passages yet</p>
                <p className="text-xs text-muted-foreground">Tap the bookmark icon on any passage to save it here</p>
              </div>
            ) : (
              passages.map(s => (
                <div key={s.id} className="bg-card rounded-xl p-5 border border-border animate-fade-in">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{s.passage.reference}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.passage.text}</p>
                      {s.note && <p className="text-xs text-muted-foreground mt-2 italic">Note: {s.note}</p>}
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        {new Date(s.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button onClick={() => handleRemove(s.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'journal' && (
          <div className="space-y-3">
            {journal.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">Your journal is empty</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/journal')}>Start Writing</Button>
              </div>
            ) : (
              journal.map(e => (
                <div key={e.id} className="bg-card rounded-xl p-5 border border-border">
                  <p className="text-sm text-foreground">{e.content}</p>
                  {e.relatedPassage && (
                    <p className="text-xs text-primary mt-2">{e.relatedPassage.reference}</p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
