import { useNavigate } from "react-router-dom";
import { FullscreenAgent } from "@/components/FullscreenAgent";

// /lite: unauthenticated burning-bush preview.
// FloatingAgent is hidden on /lite (HIDDEN_PATHS) - no UI overlap.
// Minimize returns to the marketing page (/).
export default function LiteLandingPage() {
  const navigate = useNavigate();
  return <FullscreenAgent onMinimize={() => navigate("/")} />;
}
