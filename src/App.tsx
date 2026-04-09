import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import { ConsentModal } from "@/components/ConsentModal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "./pages/NotFound";
import LegalPage from "./pages/LegalPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter>
        <ConsentModal />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/daily" element={<DailyLightPage />} />
          <Route path="/sermon" element={<SermonPage />} />
          <Route path="/guidance" element={<GuidancePage />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/legal/:policy" element={<LegalPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
