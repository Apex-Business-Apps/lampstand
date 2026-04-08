import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';

export function AuthStatus() {
  const [session, setSession] = useState<unknown>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <a href="/auth"><User className="h-4 w-4" /> Sign In</a>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground hover:text-foreground">
      <LogOut className="h-4 w-4" /> Sign Out
    </Button>
  );
}
