import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudiesProvider } from "@/context/StudiesContext";
import Index from "./pages/Index";
import Analyze from "./pages/Analyze";
import Viewer from "./pages/Viewer";
import Comparison from "./pages/Comparison";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import ManualReport from "./pages/ManualReport";
import ReconstructionLab from "./pages/ReconstructionLab";
import PipelineOrchestrator from "./pages/PipelineOrchestrator";
import GovernanceHub from "./pages/GovernanceHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StudiesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Analyze />} />
            <Route path="/recent" element={<Index />} />
            <Route path="/viewer/:studyId" element={<Viewer />} />
            <Route path="/report/:studyId" element={<ManualReport />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reconstruction" element={<ReconstructionLab />} />
            <Route path="/pipeline" element={<PipelineOrchestrator />} />
            <Route path="/governance" element={<GovernanceHub />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StudiesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
