import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

describe('route reachability definitions', () => {
  it('includes legal and return routes', () => {
    const app = fs.readFileSync('src/App.tsx', 'utf8');
    expect(app).toContain('path="/return"');
    expect(app).toContain('path="/legal/privacy"');
    expect(app).toContain('path="/legal/terms"');
  });

  it('has no duplicate path declarations', () => {
    const app = fs.readFileSync('src/App.tsx', 'utf8');
    const lectioCount = (app.match(/path="\/lectio"/g) || []).length;
    const examenCount = (app.match(/path="\/examen"/g) || []).length;
    expect(lectioCount).toBe(1);
    expect(examenCount).toBe(1);
  });
});
