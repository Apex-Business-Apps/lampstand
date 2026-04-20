import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { FloatingAgent } from "@/components/FloatingAgent";
import { ConsentModal } from "@/components/ConsentModal";
import { useAppBoot } from "@/hooks/useAppBoot";

// Lazy-load all pages for optimal code splitting
const EntryPage = lazy(() => import("./pages/EntryPage"));
const MarketingPage = lazy(() => import("./pages/MarketingPage"));
const LiteLandingPage = lazy(() => import("./pages/LiteLandingPage"));
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
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AcceptableUsePage = lazy(() => import("./pages/AcceptableUsePage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const CompanyPage = lazy(() => import("./pages/CompanyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ReturnPage = lazy(() => import("./pages/ReturnPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes before refetch
      gcTime: 30 * 60 * 1000,   // 30 minutes garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppBootGate({ children }: { children: React.ReactNode }) {
  useAppBoot();
  return <>{children}</>;
}

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppBootGate>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<EntryPage />} />
              <Route path="/entry" element={<EntryPage />} />
              <Route path="/welcome" element={<MarketingPage />} />
              <Route path="/lite" element={<LiteLandingPage />} />
              <Route path="/app" element={<HomePage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/daily" element={<DailyLightPage />} />
              <Route path="/sermon" element={<SermonPage />} />
              <Route path="/guidance" element={<GuidancePage />} />
              <Route path="/kids" element={<KidsPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/return" element={<ReturnPage />} />
              <Route path="/admin" element={<AuthGuard><AdminPage /></AuthGuard>} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/legal/terms" element={<TermsPage />} />
              <Route path="/legal/acceptable-use" element={<AcceptableUsePage />} />
              <Route path="/legal/disclaimer" element={<DisclaimerPage />} />
              <Route path="/legal/company" element={<CompanyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </AppBootGate>
          <FloatingAgent />
          <ConsentModal />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
