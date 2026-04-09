import { LegalLayout } from '@/components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>LampStand is proprietary software of APEX Business Systems LTD and is licensed to end users on a limited, revocable, non-transferable basis.</p>
      <p>Users may not scrape, reverse engineer, abuse, overload, or misuse LampStand. Users may not automate extraction of content or attempt to bypass safety restrictions.</p>
      <p>Governing law placeholder: Alberta, Canada. TODO: Counsel review required for arbitration, limitation of liability, and minors clauses.</p>
    </LegalLayout>
  );
}
