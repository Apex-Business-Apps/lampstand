import { AppShell } from '@/components/AppShell';

export default function LegalPage() {
  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6 space-y-8">
        <h1 className="text-2xl font-serif font-semibold">Legal & Compliance</h1>

        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-serif font-semibold">Ownership & License</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LampStand is proprietary software owned by APEX Business Systems LTD.
              This software is provided to end users under a limited license for personal, non-commercial use.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Restrictions: Users may not misuse, scrape, reverse engineer, or abusively use the application or its APIs.
              Governing Law: Alberta, Canada.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-semibold">AI and Spiritual Guidance Disclaimer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LampStand utilizes Artificial Intelligence to generate reflections and guide pastoral framing.
              The AI does not replace professional clergy, counseling, or therapy. The reflections provided are
              generated based on scripture but should be discerned personally.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-semibold">Terms of Service & Privacy Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              [TODO: Legal Counsel Review Required]
              Full terms of service, acceptable use policy, and privacy policy will be made available here upon formal review.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By default, LampStand is designed to be local-first and privacy-respecting. Raw audio and transcripts are not persisted
              by default unless explicit sync is enabled. Your local journal and memory remain on your device.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
