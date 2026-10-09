import { Navigate, Outlet } from "react-router-dom";
import { getProfile, ensureGuestProfile } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { isStandaloneDisplayMode } from "@/lib/pwa/standalone";

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
    // 2. If an unauthenticated visitor navigates directly to a deep feature route,
    //    automatically initialize a guest profile so external visitors and monitors pass cleanly.
    // ========================================================================
    if (isStandaloneDisplayMode()) {
      // Let native/app traffic directly to core App UI as initialized local guest
      ensureGuestProfile();
      return children ? <>{children}</> : <Outlet />;
    }
    const guest = ensureGuestProfile();
    if (guest) {
      return children ? <>{children}</> : <Outlet />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
