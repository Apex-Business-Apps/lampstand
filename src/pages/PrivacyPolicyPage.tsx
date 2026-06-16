import { LegalLayout } from '@/components/legal/LegalLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Who we are</h2>
      <p>
        LampStand is a community spiritual companion app operated by APEX Business Systems LTD.
        We are not a commercial product. There are no ads, no paywalls, and no data sold to third parties.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">What we store and where</h2>
      <p>
        LampStand is <strong>local-first by design</strong>. The following data lives only on your device
        by default:
      </p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Your journal entries</li>
        <li>Saved scripture passages</li>
        <li>App settings and preferences</li>
        <li>Voice transcripts (when voice input is used)</li>
        <li>Your presence score and streak</li>
      </ul>
      <p className="mt-3">
        <strong>Cloud sync is opt-in only.</strong> If you create an account and enable cloud sync in
        Settings, the items above are also stored in our Supabase database, hosted in the EU (Ireland)
        by Supabase Inc. You can disable cloud sync at any time in Settings, which stops future
        uploads. To delete data already uploaded, contact us (see below).
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Consent</h2>
      <p>
        Your consent choices are enforced at the write layer, not just the UI. If you have not enabled
        cloud sync, your journal and saved passages are never transmitted to our servers regardless of
        your login state. Microphone access requires a separate explicit consent in Settings.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">AI and voice processing</h2>
      <p>
        When you use the AI guidance or voice playback features, your request text is sent through
        a server-side proxy to:
      </p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>
          <strong>Groq (Llama 3 model)</strong> — for pastoral AI responses. Your request text is
          processed by Groq's API and subject to their privacy policy. Groq does not train on API
          request data by default.
        </li>
        <li>
          <strong>ElevenLabs</strong> — for text-to-speech audio. Response text is sent to ElevenLabs
          for voice synthesis. ElevenLabs does not retain audio for training by default.
        </li>
      </ul>
      <p className="mt-3">
        No private API keys are ever sent to or stored in your browser or device. All AI and TTS calls
        route through our secure server-side proxy functions.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Authentication</h2>
      <p>
        Account authentication is handled by Supabase Auth. If you sign in with a social provider
        (e.g. Google), that provider shares your email address with us. We use it only to identify
        your account — it is never used for marketing.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Cookies and local storage</h2>
      <p>
        LampStand does not use third-party cookies or tracking pixels. We use browser localStorage
        to store your settings and local data as described above. No advertising or analytics cookies
        are set.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Data deletion and export</h2>
      <p>
        You can delete all locally stored data at any time from Settings → Data Management.
        To request deletion of cloud-synced data or your account, contact:{' '}
        <strong>privacy@thelampstand.icu</strong>. We will action deletion requests within 30 days.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Children</h2>
      <p>
        LampStand is intended for users aged 13 and over. Kids Mode simplifies the interface for
        younger users but does not change data handling. We do not knowingly collect data from
        children under 13.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Changes to this policy</h2>
      <p>
        If we make material changes, we will update the date at the top of this page and, where
        possible, notify users within the app.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Contact</h2>
      <p>
        Privacy questions: <strong>privacy@thelampstand.icu</strong>
      </p>
    </LegalLayout>
  );
}
