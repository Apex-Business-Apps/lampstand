import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { FloatingAgent } from "@/components/FloatingAgent";

// Lazy-load all pages for optimal code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const DailyLightPage = lazy(() => import("./pages/DailyLightPage"));
const SermonPage = lazy(() => import("./pages/SermonPage"));
const GuidancePage = lazy(() => import("./pages/GuidancePage"));
const KidsPage = lazy(() => import("./pages/KidsPage"));
const SavedPage = lazy(() => import("./pages/SavedPage"));
const JournalPage = lazy(() => import("./pages/JournalPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AcceptableUsePage = lazy(() => import("./pages/AcceptableUsePage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const CompanyPage = lazy(() => import("./pages/CompanyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ReturnPage = lazy(() => import("./pages/ReturnPage"));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/daily" element={<DailyLightPage />} />
              <Route path="/sermon" element={<SermonPage />} />
              <Route path="/guidance" element={<GuidancePage />} />
              <Route path="/kids" element={<KidsPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/return" element={<ReturnPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/legal/terms" element={<TermsPage />} />
              <Route path="/legal/acceptable-use" element={<AcceptableUsePage />} />
              <Route path="/legal/disclaimer" element={<DisclaimerPage />} />
              <Route path="/legal/company" element={<CompanyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <FloatingAgent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
