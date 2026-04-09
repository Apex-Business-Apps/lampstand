import { LegalLayout } from '@/components/legal/LegalLayout';

export default function AcceptableUsePage() {
  return (
    <LegalLayout title="Acceptable Use Policy">
      <p>Use LampStand for scripture reading, journaling, and reflective guidance. Do not use LampStand for harassment, abusive content, disallowed automation, or adversarial prompt attacks.</p>
      <p>Attempts to bypass safety controls, extract system prompts, or induce harmful outputs can trigger circuit-breaker responses and temporary restrictions.</p>
      <p>TODO: Counsel review required for enforcement and appeals process language.</p>
    </LegalLayout>
  );
}
