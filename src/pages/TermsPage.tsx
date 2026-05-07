import { LegalLayout } from '@/components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>LampStand is proprietary software of APEX Business Systems LTD and is licensed to end users on a limited, revocable, non-transferable basis.</p>
      <p>Users may not scrape, reverse engineer, abuse, overload, or misuse LampStand. Users may not automate extraction of content or attempt to bypass safety restrictions.</p>
      <p>These terms are governed by the applicable laws identified by APEX Business Systems LTD for LampStand users. Disputes, liability limits, and age-related use restrictions apply to the fullest extent permitted by law.</p>
    </LegalLayout>
  );
}
