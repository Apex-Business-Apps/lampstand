import { LegalLayout } from '@/components/legal/LegalLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>LampStand is owned by APEX Business Systems LTD. LampStand is local-first by default. Your passages, journal entries, and adaptive memory stay on your device unless you explicitly enable cloud sync.</p>
      <p>We do not store raw microphone audio by default. Voice transcripts are local-only by default. Optional account sync is opt-in and can be disabled anytime in Settings.</p>
      <p>TODO: Counsel review required for final retention schedule, subject-access process, and Alberta and federal privacy law citation language.</p>
    </LegalLayout>
  );
}
