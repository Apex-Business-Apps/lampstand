import { AppShell } from '@/components/AppShell';
import { Link } from 'react-router-dom';

const items = [
  { to: '/legal/privacy', label: 'Privacy Policy' },
  { to: '/legal/terms', label: 'Terms of Service' },
  { to: '/legal/acceptable-use', label: 'Acceptable Use Policy' },
  { to: '/legal/disclaimer', label: 'AI and Spiritual Guidance Disclaimer' },
  { to: '/legal/company', label: 'Contact / Legal / Company' },
];

export default function LegalPage() {
  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-6">
        <h1 className="text-2xl font-semibold">Legal and Compliance</h1>
        <p className="text-sm text-muted-foreground">LampStand is proprietary software owned by APEX Business Systems LTD. Counsel-review items are marked in each legal page.</p>
        <div className="space-y-3">
          {items.map((item) => (
            <Link key={item.to} to={item.to} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
              <p className="text-base font-medium">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
