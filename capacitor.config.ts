import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'icu.thelampstand.app',
  appName: 'LampStand',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // In production the app loads from the bundled webDir; this hostname is
    // used only to satisfy Supabase's allowed-origins list during development.
    hostname: 'thelampstand.icu',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1410',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
  android: {
    buildOptions: {
      // Signing config is injected at build time via environment variables.
      // Do NOT commit keystore files or passwords.
      keystorePath: process.env.ANDROID_KEYSTORE_PATH,
      keystoreAlias: process.env.ANDROID_KEY_ALIAS,
      keystorePassword: process.env.ANDROID_KEYSTORE_PASS,
      keystoreAliasPassword: process.env.ANDROID_KEY_PASS,
    },
  },
};

export default config;
