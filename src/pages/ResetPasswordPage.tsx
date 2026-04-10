import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AgentPresence } from '@/components/AgentPresence';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

function getHashParams(hash: string) {
  return new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);

  const recoveryLinkDetected = useMemo(() => getHashParams(location.hash).get('type') === 'recovery', [location.hash]);

  useEffect(() => {
    let active = true;

    async function hydrateRecovery() {
      const params = getHashParams(location.hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (params.get('type') === 'recovery' && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (error) {
          toast.error('This reset link has expired. Request a new one.');
          if (active) setRecoveryReady(false);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (active) setRecoveryReady(Boolean(params.get('type') === 'recovery' || session));
    }

    void hydrateRecovery();
    return () => {
      active = false;
    };
  }, [location.hash]);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error) {
      toast.error((error as Error).message || 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error('Use at least 6 characters for your new password.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated. You can sign in now.');
      navigate('/auth', { replace: true });
    } catch (error) {
      toast.error((error as Error).message || 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  }

  const showUpdateForm = recoveryLinkDetected || recoveryReady;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-5">
      <button onClick={() => navigate('/auth')} className="absolute top-6 left-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="w-full max-w-sm space-y-8 text-center">
        <AgentPresence size="md" className="mx-auto" />

        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-semibold">Reset password</h1>
          <p className="text-muted-foreground text-sm">
            {showUpdateForm
              ? 'Choose a new password for your LampStand account.'
              : 'Enter your email and we will send you a secure password reset link.'}
          </p>
        </div>

        {showUpdateForm ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              autoComplete="new-password"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
              autoComplete="new-password"
            />
            <Button type="submit" disabled={loading} className="w-full gap-2">
              <KeyRound className="h-4 w-4" />
              {loading ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-4 text-left">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
            <Button type="submit" disabled={loading} className="w-full gap-2">
              <Mail className="h-4 w-4" />
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}