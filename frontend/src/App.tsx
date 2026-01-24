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

import ProtectedRoute from "@/components/ProtectedRoute";

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

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hospitals" element={
              <ProtectedRoute>
                <DashboardHospitals />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/inventory" element={
              <ProtectedRoute>
                <DashboardInventory />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/alerts" element={
              <ProtectedRoute>
                <DashboardAlerts />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/predictions" element={
              <ProtectedRoute>
                <DashboardPredictions />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/medicines" element={
              <ProtectedRoute>
                <DashboardMedicines />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
