import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { FloatingAgent } from "@/components/FloatingAgent";
import HomePage from "./pages/HomePage";
import Onboarding from "./pages/Onboarding";
import DailyLightPage from "./pages/DailyLightPage";
import SermonPage from "./pages/SermonPage";
import GuidancePage from "./pages/GuidancePage";
import KidsPage from "./pages/KidsPage";
import SavedPage from "./pages/SavedPage";
import JournalPage from "./pages/JournalPage";
import SettingsPage from "./pages/SettingsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import LegalPage from "./pages/LegalPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import AcceptableUsePage from "./pages/AcceptableUsePage";
import DisclaimerPage from "./pages/DisclaimerPage";
import CompanyPage from "./pages/CompanyPage";
import NotFound from "./pages/NotFound";
import ReturnPage from "./pages/ReturnPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
          <FloatingAgent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
