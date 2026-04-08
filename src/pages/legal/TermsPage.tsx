import { LegalLayout } from '@/components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>By using LampStand, you agree to a limited, non-transferable end-user license from APEX Business Systems LTD.</p>
      <p>You may not reverse engineer, scrape, automate abusive extraction, or attempt unauthorized access to protected services.</p>
      <p>LampStand provides scripture and reflection support. It is not medical, legal, financial, or emergency guidance.</p>
      <p><strong>TODO/UNCERTAIN:</strong> counsel review is required before final publication of governing law and dispute terms.</p>
    </LegalLayout>
  );
}
