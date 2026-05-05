import '@testing-library/jest-dom'
import 'vitest-canvas-mock'

// Mock localStorage for Bun test runner compatibility
if (typeof localStorage === 'undefined') {
  const storage: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => {
      Object.keys(storage).forEach(key => {
        delete storage[key];
      });
    },
  };
}
