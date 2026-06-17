import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConfigured } from '@/integrations/supabase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AgentPresence } from '@/components/AgentPresence';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthMode = 'login' | 'signup' | 'magic-link';

function ConfigErrorBanner() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-sm text-center space-y-4">
        <AgentPresence size="md" className="mx-auto" />
        <h1 className="text-2xl font-serif font-semibold">Configuration Error</h1>
        <p className="text-muted-foreground text-sm">
          Authentication is unavailable. The service API key is missing or invalid.
        </p>
        <p className="text-muted-foreground text-xs">
          Please contact the administrator to configure{' '}
          <code className="font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code>.
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();

  if (!isSupabaseConfigured()) {
    return <ConfigErrorBanner />;
  }

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/entry` },
        });
        if (error) throw error;
        toast.success('Account created! Check your email to confirm.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Signed in successfully.');
        navigate('/entry', { replace: true });
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/entry` },
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
          <h1 className="text-3xl font-serif font-semibold">The Lamp Stand</h1>
          <p className="text-muted-foreground text-sm">
            {mode === 'magic-link'
              ? "We'll email you a one-time sign-in link."
              : mode === 'signup'
                ? 'Create an account to sync across devices.'
                : 'Sign in to sync your saved passages and journey.'}
          </p>
        </div>

        {mode === 'magic-link' ? (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-card"
            />
            <Button type="submit" disabled={loading} className="w-full gap-2">
              <Mail className="h-4 w-4" />
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
            <button type="button" onClick={() => setMode('login')} className="text-xs text-primary hover:underline">
              Sign in with password instead
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordAuth} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-card"
              autoComplete="email"
            />
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-card pr-10"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2">
              <Lock className="h-4 w-4" />
              {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </Button>

            <div className="flex flex-col gap-2 text-xs">
              {mode === 'login' ? (
                <>
                  <button type="button" onClick={() => setMode('signup')} className="text-primary hover:underline">
                    Don't have an account? Sign up
                  </button>
                  <button type="button" onClick={() => navigate('/reset-password')} className="text-muted-foreground hover:underline">
                    Forgot password?
                  </button>
                  <button type="button" onClick={() => setMode('magic-link')} className="text-muted-foreground hover:underline">
                    Use magic link instead
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline">
                  Already have an account? Sign in
                </button>
              )}
            </div>
          </form>
        )}

        {/* Try without signing up — always visible, prominent */}
        <div className="pt-2 space-y-3">
          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-border/50" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border/50" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/lite?source=web')}
          >
            Try without signing up
          </Button>
        </div>
      </div>
    </div>
  );
}
