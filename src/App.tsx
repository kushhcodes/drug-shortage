import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardHospitals from "./pages/DashboardHospitals";
import DashboardInventory from "./pages/DashboardInventory";
import DashboardAlerts from "./pages/DashboardAlerts";
import DashboardPredictions from "./pages/DashboardPredictions";
import DashboardMedicines from "./pages/DashboardMedicines";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/hospitals" element={<DashboardHospitals />} />
            <Route path="/dashboard/inventory" element={<DashboardInventory />} />
            <Route path="/dashboard/alerts" element={<DashboardAlerts />} />
            <Route path="/dashboard/predictions" element={<DashboardPredictions />} />
            <Route path="/dashboard/medicines" element={<DashboardMedicines />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
