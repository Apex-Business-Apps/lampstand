import { LegalLayout } from '@/components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Community Terms">
      <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">What LampStand is</h2>
      <p>
        LampStand is a community spiritual companion — a free, ad-free space for daily reflection,
        scripture engagement, and pastoral guidance. It is a labour of love, not a commercial product.
        There are no subscriptions, no upsells, and no dark patterns.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">What LampStand is not</h2>
      <p>
        LampStand's AI responses, reflections, and guidance are <strong>not</strong> a substitute for:
      </p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Professional pastoral counselling or spiritual direction</li>
        <li>Mental health therapy or psychiatric care</li>
        <li>Legal or medical advice of any kind</li>
      </ul>
      <p className="mt-3">
        If you are in crisis or need professional support, please reach out to a qualified person in
        your life or a relevant emergency service.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Respectful use</h2>
      <p>By using LampStand you agree to:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Use the app in good faith and for personal spiritual purposes</li>
        <li>Not attempt to extract, scrape, or automate requests to our API</li>
        <li>Not use the app to generate content that is harmful, hateful, or abusive</li>
        <li>Not try to circumvent safety or consent features</li>
        <li>Not reverse-engineer or misuse the service</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">Your content</h2>
      <p>
        Your journal entries, saved passages, and notes belong to you. We do not claim any rights
        over your personal content. If you enable cloud sync, you grant us a limited licence to store
        and return that content to you. We do not use your content for AI training.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Availability</h2>
      <p>
        LampStand is provided as-is by a small community team. We aim for reliability but cannot
        guarantee uninterrupted service. Core features work offline and local data is always
        accessible even when servers are unavailable.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Governing law</h2>
      <p>
        These terms are governed by the laws of England and Wales. Disputes will be resolved in
        accordance with those laws to the fullest extent permitted.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Contact and support</h2>
      <p>
        Questions, feedback, or support: <strong>hello@thelampstand.icu</strong>
      </p>
      <p className="mt-2">
        We are a small team. We read every message and respond when we can.
      </p>
    </LegalLayout>
  );
}
