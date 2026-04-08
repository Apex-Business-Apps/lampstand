import { LegalLayout } from '@/components/legal/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>LampStand is local-first by default. Journal entries, saved passages, and guidance transcripts remain on your device unless you opt in to cloud sync.</p>
      <p>Raw audio is never stored by default. Voice transcripts remain local by default and can be deleted in Settings at any time.</p>
      <p>Notification permissions and microphone permissions are opt-in only and can be revoked in your browser or operating system.</p>
      <p><strong>TODO/UNCERTAIN:</strong> counsel review is still required for region-specific retention and regulatory terms.</p>
      <p>Copyright and software ownership are held by APEX Business Systems LTD. This product is proprietary software provided under a limited end-user license.</p>
    </LegalLayout>
  );
}
