import '@testing-library/jest-dom'
import 'vitest-canvas-mock'

// Mock localStorage for Bun test runner compatibility
if (typeof localStorage === 'undefined') {
  const storage: Record<string, string> = {};
  const mockStorage: Storage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => {
      Object.keys(storage).forEach(key => {
        delete storage[key];
      });
    },
    key: (index: number) => Object.keys(storage)[index] || null,
    length: 0,
  };

  Object.defineProperty(mockStorage, 'length', {
    get: () => Object.keys(storage).length,
  });

  Object.defineProperty(globalThis, 'localStorage', {
    value: mockStorage,
    writable: true,
  });
}

// Mock environment variables for Supabase
import { vi } from 'vitest';
vi.stubEnv('VITE_SUPABASE_URL', 'https://mock.supabase.co');
// Must start with eyJ (JWT shape) to pass production validation in config.ts
vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.test');
