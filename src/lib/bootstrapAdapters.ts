import { setAIAdapter } from '@/lib/adapters';

export function bootstrapAdapters(): void {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    // Dynamic import to avoid bundling GroqAIAdapter into the guest-mode critical path
    import('@/lib/groq').then(({ GroqAIAdapter }) => {
      setAIAdapter(new GroqAIAdapter());
    }).catch(() => {
      // GroqAIAdapter unavailable — LocalAIAdapter remains active (already the default)
    });
  }
  // Otherwise LocalAIAdapter remains (already the default in adapters.ts)
}
