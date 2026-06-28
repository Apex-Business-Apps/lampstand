import { Navigate } from "react-router-dom";
import { getProfile } from "@/lib/storage";

export default function LiteLandingPage() {
  const profile = getProfile();
  const target = profile?.onboardingComplete ? "/app" : "/onboarding";

  return <Navigate to={target} replace />;
}
