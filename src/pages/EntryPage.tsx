import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/lib/storage";

function isStandaloneDisplayMode() {
  const mediaMatch = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mediaMatch || iosStandalone;
}

export default function EntryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const profile = getProfile();
    const params = new URLSearchParams(location.search);
    const entry = params.get("entry")?.toLowerCase();
    const source = params.get("source")?.toLowerCase();

    const forceOnboarding = entry === "onboarding" || source === "ios" || source === "android" || source === "native";
    const forceLite = entry === "lite";

    // ========================================================================
    // CRITICAL ROUTING RULE (DO NOT DRIFT):
    // 1. If a user opens the installed PWA App (standalone display), they MUST 
    //    go straight into the Login Page (/auth) if unauthenticated, or /app if authenticated.
    // ========================================================================
    if (isStandaloneDisplayMode()) {
      if (user || profile?.onboardingComplete) {
        navigate("/app", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
      return;
    }

    // ========================================================================
    // 2. We are in a standard browser. 
    // If they clicked "Walk into the Light" from the marketing page, let them in.
    // ========================================================================
    if (forceOnboarding) {
      if (user) {
        navigate(profile?.onboardingComplete ? "/app" : "/onboarding", { replace: true });
        return;
      }
      if (profile?.onboardingComplete) {
        navigate("/app", { replace: true });
        return;
      }
      navigate("/onboarding", { replace: true });
      return;
    }

    if (forceLite) {
      navigate("/lite", { replace: true });
      return;
    }

    // ========================================================================
    // 3. Default for browser root ('/') is ALWAYS the marketing page, 
    //    even if they have a local profile. They must see the landing page first.
    // ========================================================================
    navigate("/welcome", { replace: true });
  }, [loading, location.search, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
