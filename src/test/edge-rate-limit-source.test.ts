import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const files = [
  'supabase/functions/groq-guidance/index.ts',
  'supabase/functions/elevenlabs-tts/index.ts',
];

describe('edge function rate-limit source', () => {
  it.each(files)('%s uses atomic RPC and fails closed', (file) => {
    const source = fs.readFileSync(file, 'utf8');
    expect(source).toContain("supabase.rpc('increment_api_rate_limit'");
    expect(source).toContain('allowed: false');
    expect(source).toContain('status: 429');
    expect(source).not.toContain('request_count: 1');
    expect(source).not.toContain('data.request_count > 1');
  });

  it('migration atomically increments on unique-key conflict and returns count', () => {
    const source = fs.readFileSync('supabase/migrations/20260616000000_atomic_rate_limit_rpc.sql', 'utf8');
    expect(source).toContain('on conflict (bucket_key, endpoint, window_start)');
    expect(source).toContain('request_count = api_rate_limits.request_count + 1');
    expect(source).toContain('return v_count');
  });
});
