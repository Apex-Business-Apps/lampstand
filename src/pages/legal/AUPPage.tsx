import { LegalLayout } from '@/components/legal/LegalLayout';

export default function AUPPage() {
  return (
    <LegalLayout title="Acceptable Use Policy">
      <p>You must not use LampStand for abuse, harassment, deception, exploitation, or attempts to bypass safety controls.</p>
      <p>Automated scraping, reverse engineering, model extraction attempts, and overload traffic patterns are prohibited.</p>
      <p>Accounts or sessions violating these restrictions may be limited to scripture-only mode or disabled.</p>
    </LegalLayout>
  );
}
