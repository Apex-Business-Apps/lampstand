import { Navigate, Outlet } from "react-router-dom";
import { getProfile } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

function isStandaloneDisplayMode() {
  const mediaMatch = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
    true;
  return mediaMatch || iosStandalone;
}

interface ProfileGuardProps {
  children?: ReactNode;
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const profile = getProfile();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile && !user) {
    // ========================================================================
    // CRITICAL ROUTING RULE (DO NOT DRIFT):
    // 1. If a user opens the installed PWA App (standalone display), they MUST
    //    go straight into the core App UI.
    // 2. If a user tries to access /app or protected routes in a standard browser
    //    without auth, they MUST be redirected to the Marketing Page (/).
    // ========================================================================
    if (isStandaloneDisplayMode()) {
      // Let native/app traffic directly to core App UI
      return children ? <>{children}</> : <Outlet />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
