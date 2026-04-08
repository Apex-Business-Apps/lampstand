import { AppShell } from '@/components/AppShell';

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-8 font-body">
        <h1 className="font-display text-3xl font-semibold tracking-wide">{title}</h1>
        <div className="space-y-4 text-base leading-8 text-foreground/90">{children}</div>
      </article>
    </AppShell>
  );
}
