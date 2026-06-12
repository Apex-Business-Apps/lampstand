import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/lib/storage";

function isStandaloneDisplayMode() {
  const mediaMatch = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
    true;
  return mediaMatch || iosStandalone;
}

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
      navigate("/lite", { replace: true });
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

    navigate("/", { replace: true });
  }, [loading, location.search, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
