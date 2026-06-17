import { setAIAdapter } from '@/lib/adapters';
import { isSupabaseConfigured } from '@/integrations/supabase/config';

export function bootstrapAdapters(): void {
  if (isSupabaseConfigured()) {
    // Dynamic import to avoid bundling GroqAIAdapter into the guest-mode critical path
    import('@/lib/groq').then(({ GroqAIAdapter }) => {
      setAIAdapter(new GroqAIAdapter());
    }).catch(() => {
      // GroqAIAdapter unavailable — LocalAIAdapter remains active (already the default)
    });
  }
  // Otherwise LocalAIAdapter remains (already the default in adapters.ts)
}
