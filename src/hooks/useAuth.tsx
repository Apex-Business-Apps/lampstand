import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveAuthState } from '@/lib/storage';
import { runFullSync } from '@/lib/supabaseSync';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateAuthenticatedSession = useCallback(async (user: User) => {
    try {
      await runFullSync(user.id);
    } catch {
      // Keep auth usable even if sync fails.
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSession = useCallback((s: Session | null) => {
    setSession(s);
    if (s?.user) {
      setLoading(true);
      saveAuthState({ mode: 'authenticated', userId: s.user.id, email: s.user.email });
      void hydrateAuthenticatedSession(s.user);
    } else {
      saveAuthState({ mode: 'guest' });
      setLoading(false);
    }
  }, [hydrateAuthenticatedSession]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signOut = async () => {
    await supabase.auth.signOut();
    saveAuthState({ mode: 'guest' });
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
