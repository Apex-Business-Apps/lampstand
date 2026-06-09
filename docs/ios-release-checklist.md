# iOS Release Checklist

LampStand targets the App Store as an installable iOS app via Capacitor.

## Prerequisites

- Mac with Xcode 15+ installed
- Active Apple Developer account (Team ID)
- Provisioning profile and signing certificate configured in Xcode

## One-Time Local Setup (run once per developer machine)

```bash
# 1. Install Capacitor iOS platform (generates the ios/ project)
npx cap add ios

# 2. Sync the web build into the native project
npm run cap:sync

# 3. Open in Xcode to configure signing and verify
npm run cap:open:ios
```

The generated `ios/` directory should be committed to the repository after initial setup.

## Signing Configuration

**Never commit signing certificates, provisioning profiles, or Team IDs to the repository.**

In Xcode:
1. Open `ios/App/App.xcworkspace`
2. Select the `App` target → Signing & Capabilities
3. Set your **Team** (Apple Developer Team ID — placeholder: `XXXXXXXXXX`)
4. Enable **Automatically manage signing**
5. Choose the correct bundle identifier: `icu.thelampstand.app`

For CI/CD signing, use environment variables via Xcode Cloud or fastlane — never hardcode.

## Required Privacy Usage Strings

Add the following to `ios/App/App/Info.plist` if any of these APIs are used:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>LampStand uses your microphone only when you tap the voice input button, to convert your spoken request into text. Audio is processed on-device and is never stored or transmitted.</string>

<key>NSSpeechRecognitionUsageDescription</key>
<string>LampStand uses speech recognition to transcribe your spoken requests into text. Transcripts are stored locally on your device only.</string>
```

## Release Build

```bash
# Sync web assets to native project
npm run cap:sync

# Then build and archive in Xcode:
# Product → Archive → Distribute App → App Store Connect
```

Or using the CLI:

```bash
npm run ios:build
```

## App Store Connect Steps

1. Create app record in [App Store Connect](https://appstoreconnect.apple.com).
2. Bundle ID: `icu.thelampstand.app`
3. App Name: **LampStand**
4. Category: **Reference** (primary), **Lifestyle** (secondary)
5. Age Rating: 4+ (no objectionable content)
6. Upload build via Xcode → Distribute App → TestFlight
7. Fill in **App Privacy** section:
   - **Data Not Collected**: advertising data, precise location, browsing history, purchase history, contacts, health, financial info, usage data (analytics disabled)
   - **Data Linked to User** (when cloud sync enabled): name (first name only), user content (journal entries, saved passages)
   - **Data Not Linked to User**: voice transcripts (on-device only, not transmitted)

## Reviewer Access

If the app requires authentication to use core features, provide reviewer credentials:
- App Store Connect → App Information → Review Notes
- Explain: "Tap 'Continue as Guest' on the auth screen to use all core features without an account. An account is optional and only required for cloud sync."

## TestFlight Path

1. Submit build to TestFlight internal testing
2. Invite internal testers (Apple Developer account members)
3. After successful internal testing, submit for external TestFlight (up to 10,000 testers)
4. After external testing, submit for App Review

## Testing Before Public Release

- [ ] Install on a physical iOS device from TestFlight
- [ ] Complete onboarding flow end-to-end
- [ ] Verify microphone permission prompt appears at correct time (only after user enables in Settings)
- [ ] Test TTS playback
- [ ] Test offline mode — app loads with locally cached content
- [ ] Verify app does not crash on first install
- [ ] Verify app state persists correctly across background/foreground transitions
- [ ] Test on both iPhone and iPad (ensure layout is acceptable on larger screen)
- [ ] Verify dark mode support

## Common Rejection Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Guideline 4.0 — Design (thin wrapper) | App has offline capability, local-first data, native navigation patterns — not a simple web redirect |
| Guideline 5.1.1 — Privacy practices disclosure | App Privacy answers accurately reflect all data handling; privacy policy URL included |
| Missing usage string for microphone | NSMicrophoneUsageDescription added to Info.plist |
| In-app purchase requirement for spiritual content | LampStand is free with no paywalls or IAP; clearly stated in store description |
| Counselling / medical claims | All legal and disclaimer pages clearly state LampStand is not professional counselling, medical, or legal advice |
