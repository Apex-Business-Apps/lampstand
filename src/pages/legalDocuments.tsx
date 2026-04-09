import { AppShell } from '@/components/AppShell';
import { Link, useLocation } from 'react-router-dom';

const legalDocs = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      'LampStand operates as a local-first product by default. Journal entries, saved passages, reflections, and transcripts stay on your device unless you explicitly enable cloud sync.',
      'Raw microphone audio is never persisted by default. Voice transcripts are stored locally only unless cloud sync is enabled in settings.',
      'APEX Business Systems LTD. provides LampStand as proprietary software under a limited end-user license.',
      'If you enable cloud sync, account metadata and synced records are processed by Supabase according to your project configuration.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      'LampStand is proprietary software owned by APEX Business Systems LTD. Access is granted under a limited, revocable, non-transferable license for lawful use.',
      'You agree not to scrape, reverse engineer, abuse, disrupt, or attempt unauthorized access to LampStand systems or APIs.',
      'LampStand provides scripture and reflective guidance. It does not provide medical, legal, or emergency services.',
      'Breach of these terms may result in access suspension or termination.',
    ],
  },
  aup: {
    title: 'Acceptable Use Policy',
    sections: [
      'Do not use LampStand to generate harassment, hate, violence, or deceptive content.',
      'Do not attempt prompt injection, safety bypasses, or agent hijacking behavior.',
      'Do not automate scraping, model extraction, or abuse of service endpoints.',
      'Use LampStand respectfully and only for lawful personal or organizational purposes.',
    ],
  },
  disclaimer: {
    title: 'AI and Spiritual Guidance Disclaimer',
    sections: [
      'LampStand can generate guidance using AI providers when enabled. Outputs are supportive reflections, not doctrinal authority.',
      'AI guidance can be incomplete or incorrect. Validate important decisions with trusted clergy and qualified professionals.',
      'In urgent safety or health situations, contact local emergency services immediately.',
    ],
  },
} as const;

const nav = [
  { key: 'privacy', label: 'Privacy' },
  { key: 'terms', label: 'Terms' },
  { key: 'aup', label: 'AUP' },
  { key: 'disclaimer', label: 'AI Disclaimer' },
] as const;

export default function LegalDocumentsPage() {
  const location = useLocation();
  const slug = location.pathname.split('/').pop() as keyof typeof legalDocs;
  const doc = legalDocs[slug] ?? legalDocs.privacy;

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-wide">{doc.title}</h1>
          <p className="text-sm text-muted-foreground">LampStand legal and policy documentation.</p>
        </div>

        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {nav.map((item) => (
            <Link
              key={item.key}
              to={`/legal/${item.key}`}
              className={`rounded-md border px-3 py-2 text-center text-xs font-medium ${slug === item.key ? 'bg-accent text-accent-foreground border-primary' : 'bg-card text-muted-foreground'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <article className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
          {doc.sections.map((section) => (
            <p key={section} className="text-base leading-7">
              {section}
            </p>
          ))}
        </article>
      </div>
    </AppShell>
  );
}
