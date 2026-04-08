import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { saveJournalEntry, getJournalEntries, removeJournalEntry } from '@/lib/storage';
import type { JournalEntry } from '@/types';
import { PenLine, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JournalPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState(getJournalEntries);

  function handleSave() {
    if (!content.trim()) return;
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    saveJournalEntry(entry);
    setContent('');
    setEntries(getJournalEntries());
  }

  function handleDelete(id: string) {
    removeJournalEntry(id);
    setEntries(getJournalEntries());
  }

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <h1 className="text-2xl font-serif font-semibold">Journal</h1>
        <p className="text-sm text-muted-foreground">A private space for your thoughts, reflections, and prayers. Everything stays on your device.</p>

        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write what's on your heart..."
            className="min-h-[120px] resize-none bg-card"
            maxLength={2000}
          />
          <Button onClick={handleSave} disabled={!content.trim()} className="w-full gap-2">
            <PenLine className="h-4 w-4" /> Save Entry
          </Button>
        </div>

        <div className="space-y-3">
          {entries.map(e => (
            <div key={e.id} className="bg-card rounded-xl p-5 border border-border animate-fade-in">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{e.content}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(e.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => handleDelete(e.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
