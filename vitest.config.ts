import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.test.ts'],
    exclude: ['e2e/**'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
