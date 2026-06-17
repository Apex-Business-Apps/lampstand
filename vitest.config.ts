import { defineConfig, configDefaults } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(__dirname, './src/test/setup.ts')],
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    env: {
      VITE_SUPABASE_URL: 'https://mock.supabase.co',
      // Must start with eyJ (JWT shape) to pass production validation in config.ts
      VITE_SUPABASE_PUBLISHABLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test',
    }
  }
})
