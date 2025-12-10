import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudiesProvider } from "@/context/StudiesContext";
import Index from "./pages/Index";
import Viewer from "./pages/Viewer";
import Comparison from "./pages/Comparison";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ReportEntry from "./pages/ReportEntry";
import Analyze from "./pages/Analyze";
import { NotificationsProvider } from "./context/NotificationsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StudiesProvider>
          <NotificationsProvider>
          <Routes>
            <Route path="/" element={<Analyze />} />
            <Route path="/recent-analyses" element={<Index />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/viewer/:studyId" element={<Viewer />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/report/:studyId" element={<ReportEntry />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </NotificationsProvider>
        </StudiesProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
