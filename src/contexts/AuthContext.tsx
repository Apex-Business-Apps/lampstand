import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, hasSupabaseConfig } from '@/integrations/supabase/client';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  guestMode: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  enableGuestMode: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const GUEST_KEY = 'lampstand_guest_mode';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState<boolean>(() => localStorage.getItem(GUEST_KEY) === 'true');

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setGuestMode(false);
        localStorage.removeItem(GUEST_KEY);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    loading,
    guestMode,
    async signInWithMagicLink(email: string) {
      if (!hasSupabaseConfig) return { error: 'Supabase auth is not configured.' };
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      return error ? { error: error.message } : {};
    },
    async signInWithGoogle() {
      if (!hasSupabaseConfig) return { error: 'Supabase auth is not configured.' };
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` },
      });
      return error ? { error: error.message } : {};
    },
    async signOut() {
      if (hasSupabaseConfig) {
        await supabase.auth.signOut();
      }
      setSession(null);
      setGuestMode(false);
      localStorage.removeItem(GUEST_KEY);
    },
    enableGuestMode() {
      localStorage.setItem(GUEST_KEY, 'true');
      setGuestMode(true);
    },
  }), [session, loading, guestMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
