import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { isStandaloneDisplayMode } from "@/lib/pwa/standalone";

export default function EntryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const profile = getProfile();
    if (user) {
      navigate(profile?.onboardingComplete ? "/app" : "/onboarding", {
        replace: true,
      });
      return;
    }

    if (profile?.onboardingComplete) {
      navigate("/app", { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const entry = params.get("entry")?.toLowerCase();
    const source = params.get("source")?.toLowerCase();

    const forceOnboarding =
      entry === "onboarding" ||
      source === "ios" ||
      source === "android" ||
      source === "native";
    const forceLite = entry === "lite";

    if (forceOnboarding) {
      navigate("/onboarding", { replace: true });
      return;
    }

    if (forceLite) {
      navigate("/onboarding", { replace: true });
      return;
    }

    // ========================================================================
    // CRITICAL ROUTING RULE (DO NOT DRIFT):
    // 1. If a user opens the installed PWA App (standalone display), they MUST
    //    go straight into the core App UI.
    // 2. If a user types the URL in a browser (standard display), they MUST land
    //    on the Marketing Page (/) before they can login.
    // ========================================================================
    if (isStandaloneDisplayMode()) {
      navigate("/app", { replace: true });
      return;
    }

    // ========================================================================
    // RACE CONDITION GUARD:
    // After signInWithPassword, AuthProvider context may still be stale
    // (loading=false, user=null) because onAuthStateChange hasn't fired yet.
    // Before giving up and redirecting to /, do a direct session check.
    // ========================================================================
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const freshProfile = getProfile();
        navigate(
          freshProfile?.onboardingComplete ? "/app" : "/onboarding",
          { replace: true }
        );
      } else {
        navigate("/", { replace: true });
      }
    });
  }, [loading, location.search, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
