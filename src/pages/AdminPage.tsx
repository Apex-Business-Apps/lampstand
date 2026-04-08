import { AppShell } from '@/components/AppShell';
import { SEED_THEMES } from '@/data/seed';
import { getSafetyEvents } from '@/lib/storage';
import { Shield, BookOpen, Settings2 } from 'lucide-react';

export default function AdminPage() {
  const safetyEvents = getSafetyEvents();

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <h1 className="text-2xl font-serif font-semibold">Admin Shell</h1>
        <p className="text-sm text-muted-foreground">Lightweight content and safety administration</p>

        <Section icon={BookOpen} title="Content Themes">
          <div className="space-y-2">
            {SEED_THEMES.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.passages.length} passages</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.active ? 'bg-sage-soft text-sage' : 'bg-muted text-muted-foreground'}`}>
                  {t.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Shield} title="Safety Events">
          {safetyEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No safety events recorded</p>
          ) : (
            <div className="space-y-2">
              {safetyEvents.slice(-10).reverse().map(e => (
                <div key={e.id} className="bg-card rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive capitalize">{e.type}</span>
                    <span className="text-xs text-muted-foreground">{e.action}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{e.input}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(e.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section icon={Settings2} title="Configuration Hooks">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              Translation configs, safety rules, and content versioning hooks are designed as pluggable interfaces. Connect your content management system or admin API here.
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-xs font-mono text-muted-foreground">• IRetrievalAdapter — scripture retrieval</p>
              <p className="text-xs font-mono text-muted-foreground">• IAIAdapter — AI inference</p>
              <p className="text-xs font-mono text-muted-foreground">• ContentTheme — curated themes</p>
              <p className="text-xs font-mono text-muted-foreground">• TranslationConfig — translation management</p>
            </div>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-serif font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
