import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

describe('route reachability definitions', () => {
  it('includes legal and return routes', () => {
    const app = fs.readFileSync('src/App.tsx', 'utf8');
    expect(app).toContain('path="/return"');
    expect(app).toContain('path="/legal/privacy"');
    expect(app).toContain('path="/legal/terms"');
  });
});
