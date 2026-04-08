import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const { signInWithMagicLink, signInWithGoogle, enableGuestMode } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleMagicLink() {
    setLoading(true);
    const result = await signInWithMagicLink(email);
    setLoading(false);
    setStatus(result.error ? result.error : 'Check your email for the LampStand sign in link.');
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (result.error) setStatus(result.error);
  }

  function continueAsGuest() {
    enableGuestMode();
    navigate('/onboarding');
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-md space-y-6 px-4 py-8">
        <h1 className="font-display text-3xl font-semibold">LampStand sign in</h1>
        <p className="text-sm text-muted-foreground">Sign in is optional. You can continue in guest mode and keep your data local.</p>
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button className="w-full" onClick={handleMagicLink} disabled={!email || loading}>Email magic link</Button>
          <Button className="w-full" variant="outline" onClick={handleGoogle} disabled={loading}>Continue with Google</Button>
          <Button className="w-full" variant="ghost" onClick={continueAsGuest}>Continue as guest</Button>
          {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </div>
      </div>
    </AppShell>
  );
}
