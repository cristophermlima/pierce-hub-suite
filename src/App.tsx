import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Appointments from "./pages/Appointments";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Loyalty from "./pages/Loyalty";
import POS from "./pages/POS";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Catalogs from "./pages/Catalogs";
import PublicCatalog from "./pages/PublicCatalog";
import NotFound from "./pages/NotFound";
import React from "react";
import Auth from "./pages/Auth";
import Subscription from "./pages/Subscription";
import Terms from "./pages/Terms";
import ClientForm from "./pages/ClientForm";
import { AuthProvider } from "./context/AuthContext";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { PermissionGuard } from "./components/auth/PermissionGuard";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppSettingsProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <TooltipProvider>
                <Toaster />
                <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Rota pública de autenticação */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Rota pública do formulário do cliente */}
                  <Route path="/client-form/:token" element={<ClientForm />} />
                  
                  {/* Rota pública do catálogo */}
                  <Route path="/catalog/:token" element={<PublicCatalog />} />
                  
                  {/* Rota de assinatura */}
                  <Route path="/subscription" element={<Subscription />} />
                  
                  {/* Rota de termos e contrato */}
                  <Route path="/terms" element={<Terms />} />
                  
                  {/* Rotas de administração (somente para o proprietário do SaaS) */}
                  <Route path="/admin" element={<ProtectedRoute isAdmin={true} />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                    </Route>
                  </Route>
                  
                  {/* Rotas protegidas que requerem autenticação */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="/clients" element={
                        <PermissionGuard permission="clients">
                          <Clients />
                        </PermissionGuard>
                      } />
                      <Route path="/appointments" element={
                        <PermissionGuard permission="appointments">
                          <Appointments />
                        </PermissionGuard>
                      } />
                      <Route path="/inventory" element={
                        <PermissionGuard permission="inventory">
                          <Inventory />
                        </PermissionGuard>
                      } />
                      <Route path="/catalogs" element={
                        <PermissionGuard permission="inventory">
                          <Catalogs />
                        </PermissionGuard>
                      } />
                      <Route path="/suppliers" element={
                        <PermissionGuard permission="inventory">
                          <Suppliers />
                        </PermissionGuard>
                      } />
                      <Route path="/loyalty" element={
                        <PermissionGuard permission="clients">
                          <Loyalty />
                        </PermissionGuard>
                      } />
                      <Route path="/pos" element={
                        <PermissionGuard permission="pos">
                          <POS />
                        </PermissionGuard>
                      } />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/reports" element={
                        <PermissionGuard permission="reports">
                          <Reports />
                        </PermissionGuard>
                      } />
                      <Route path="/settings" element={
                        <PermissionGuard permission="settings">
                          <Settings />
                        </PermissionGuard>
                      } />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </AppSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
