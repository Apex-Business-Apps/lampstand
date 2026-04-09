import type { ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AppShell>
      <div className="px-5 pt-8 pb-8 space-y-6">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="space-y-4 text-base leading-8 text-muted-foreground">{children}</div>
      </div>
    </AppShell>
  );
}
