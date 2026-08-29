import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { ProfileGuard } from "@/components/ProfileGuard";
import { FloatingAgent } from "@/components/FloatingAgent";
import { useAppBoot } from "@/hooks/useAppBoot";

// Lazy-load all pages with automated single-reload recovery for rotated chunk hashes
const MarketingPage = lazyWithRetry(() => import("./pages/MarketingPage"));
const LiteLandingPage = lazyWithRetry(() => import("./pages/LiteLandingPage"));
const HomePage = lazyWithRetry(() => import("./pages/HomePage"));
const Onboarding = lazyWithRetry(() => import("./pages/Onboarding"));
const DailyLightPage = lazyWithRetry(() => import("./pages/DailyLightPage"));
const SermonPage = lazyWithRetry(() => import("./pages/SermonPage"));
const GuidancePage = lazyWithRetry(() => import("./pages/GuidancePage"));
const KidsPage = lazyWithRetry(() => import("./pages/KidsPage"));
const SavedPage = lazyWithRetry(() => import("./pages/SavedPage"));
const JournalPage = lazyWithRetry(() => import("./pages/JournalPage"));
const SettingsPage = lazyWithRetry(() => import("./pages/SettingsPage"));
const AdminPage = lazyWithRetry(() => import("./pages/AdminPage"));
const AuthPage = lazyWithRetry(() => import("./pages/AuthPage"));
const ResetPasswordPage = lazyWithRetry(() => import("./pages/ResetPasswordPage"));
const LegalPage = lazyWithRetry(() => import("./pages/LegalPage"));
const PrivacyPolicyPage = lazyWithRetry(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazyWithRetry(() => import("./pages/TermsPage"));
const AcceptableUsePage = lazyWithRetry(() => import("./pages/AcceptableUsePage"));
const DisclaimerPage = lazyWithRetry(() => import("./pages/DisclaimerPage"));
const CompanyPage = lazyWithRetry(() => import("./pages/CompanyPage"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const ReturnPage = lazyWithRetry(() => import("./pages/ReturnPage"));
const InstallPage = lazyWithRetry(() => import("./pages/InstallPage"));
const PrayerCirclesPage = lazyWithRetry(() => import("./pages/PrayerCirclesPage"));
const PrayerCircleDetailPage = lazyWithRetry(
  () => import("./pages/PrayerCircleDetailPage"),
);
const LectioPage = lazyWithRetry(() => import("./pages/LectioPage"));
const ExamenPage = lazyWithRetry(() => import("./pages/ExamenPage"));
const EntryPage = lazyWithRetry(() => import("./pages/EntryPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes before refetch
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          Loading…
        </p>
      </div>
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
                  <Route path="/" element={<MarketingPage />} />
                  {/* /welcome alias: kept for backward compat with old links/bookmarks */}
                  <Route path="/welcome" element={<MarketingPage />} />
                  <Route path="/entry" element={<EntryPage />} />

                  <Route path="/lite" element={<LiteLandingPage />} />
                  <Route path="/onboarding" element={<Onboarding />} />

                  {/*
                ========================================================================
                CRITICAL ROUTING RULE (DO NOT DRIFT):
                The ProfileGuard explicitly enforces that browser users go to /
                (Marketing) and standalone/PWA users may enter /app as local
                guests if unauthenticated. Do not expose these app routes
                without this guard.
                ========================================================================
              */}
                  <Route element={<ProfileGuard />}>
                    <Route path="/app" element={<HomePage />} />
                    <Route path="/daily" element={<DailyLightPage />} />
                    <Route path="/sermon" element={<SermonPage />} />
                    <Route path="/guidance" element={<GuidancePage />} />
                    <Route path="/kids" element={<KidsPage />} />
                    <Route path="/saved" element={<SavedPage />} />
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/examen" element={<ExamenPage />} />
                    <Route path="/lectio" element={<LectioPage />} />
                    <Route path="/circles" element={<PrayerCirclesPage />} />
                    <Route
                      path="/circles/:id"
                      element={<PrayerCircleDetailPage />}
                    />
                  </Route>

                  <Route path="/return" element={<ReturnPage />} />
                  <Route path="/install" element={<InstallPage />} />
                  <Route
                    path="/admin"
                    element={
                      <AuthGuard>
                        <AdminPage />
                      </AuthGuard>
                    }
                  />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                  />
                  <Route path="/legal" element={<LegalPage />} />
                  <Route
                    path="/legal/privacy"
                    element={<PrivacyPolicyPage />}
                  />
                  <Route path="/legal/terms" element={<TermsPage />} />
                  <Route
                    path="/legal/acceptable-use"
                    element={<AcceptableUsePage />}
                  />
                  <Route
                    path="/legal/disclaimer"
                    element={<DisclaimerPage />}
                  />
                  <Route path="/legal/company" element={<CompanyPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AppBootGate>
            <FloatingAgent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;