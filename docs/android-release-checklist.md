# Android Release Checklist

LampStand targets the Play Store as an installable Android app via Capacitor.

## One-Time Local Setup (run once per developer machine)

```bash
# 1. Install Capacitor Android platform (generates the android/ project)
npx cap add android

# 2. Sync the web build into the native project
npm run cap:sync

# 3. Open in Android Studio to verify before building
npm run cap:open:android
```

The generated `android/` directory should be committed to the repository after initial setup.

## Build Configuration

All signing secrets are injected via environment variables at build time — never commit them.

| Variable | Description |
|---|---|
| `ANDROID_KEYSTORE_PATH` | Absolute path to your `.jks` or `.keystore` file |
| `ANDROID_KEY_ALIAS` | Key alias inside the keystore |
| `ANDROID_KEYSTORE_PASS` | Keystore password |
| `ANDROID_KEY_PASS` | Key password (often the same) |

### Generating a keystore (first time only)

```bash
keytool -genkeypair -v -keystore lampstand-release.jks \
  -alias lampstand -keyalg RSA -keysize 2048 -validity 10000
```

Store the `.jks` file securely (password manager or encrypted secrets store). **Never commit it.**

## Release Build

```bash
# Ensure environment variables are set, then:
npm run android:build
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

For Play Store upload, build an `.aab` instead:

```bash
cd android && ./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Play Console Steps

1. Create app in [Google Play Console](https://play.google.com/console).
2. Upload the `.aab` to the Internal Testing track first.
3. Fill in **Data Safety** section:
   - Collects journal text and saved passages: **Yes, encrypted, user-can-delete**
   - Collects voice transcripts locally: **Yes, on-device only**
   - Shares data with third parties: **Yes** — AI guidance via Groq (server-side proxy only), TTS via ElevenLabs (server-side proxy only). No raw user content is logged by these providers beyond what is required for request fulfilment.
   - Uses advertising ID: **No**
4. Set target audience: 13+ (contains spiritual/religious content; no child-directed features).
5. Complete content rating questionnaire — select "Reference" and "Religion" categories.
6. Add privacy policy URL: `https://thelampstand.icu/privacy`

## Testing Before Public Release

- [ ] Install on a physical Android device from the Internal track
- [ ] Complete onboarding flow end-to-end
- [ ] Enable cloud sync and verify journal entries sync correctly
- [ ] Disable cloud sync and verify journal entries remain local only
- [ ] Test voice input (microphone permission prompt appears correctly)
- [ ] Test TTS playback
- [ ] Test offline mode — app loads and local data is accessible
- [ ] Verify no crash on first install (fresh state)
- [ ] Verify Back button behaviour throughout the app
- [ ] Verify dark/light theme persists across app restarts

## Common Rejection Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Thin website wrapper rejection | App has offline capability, native navigation, and local-first data — not a simple web redirect |
| Missing privacy policy | Policy at `/privacy` covers all data practices |
| Misleading permissions | Microphone permission is only requested after explicit user consent in Settings |
| Sensitive content | Spiritual content is disclosed in store listing; no violence, adult content, or hate speech |
