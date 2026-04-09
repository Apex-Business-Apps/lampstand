import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AgentPresence } from '@/components/AgentPresence';
import { ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast.success('Magic link sent! Check your email.');
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-5">
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="w-full max-w-sm space-y-8 text-center">
        <AgentPresence size="md" className="mx-auto" />

        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-semibold">LampStand</h1>
          <p className="text-muted-foreground text-sm">Sign in to sync your saved passages and journey across devices.</p>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-card"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full gap-2">
            <Mail className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </form>

        <div className="pt-4 text-xs text-muted-foreground space-y-2">
          <p>LampStand is local-first. You do not need to sign in to use it.</p>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
