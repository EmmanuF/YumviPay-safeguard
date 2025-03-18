
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppInitializer from '@/components/AppInitializer';
import './App.css';

// Core pages
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import SendMoney from '@/pages/SendMoney';
import TransactionHistory from '@/pages/TransactionHistory';
import Recipients from '@/pages/Recipients';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import SessionTimeout from '@/components/security/SessionTimeout';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminTransactions from '@/pages/admin/AdminTransactions';

// Footer pages
import AboutUs from '@/pages/company/AboutUs';
import TermsOfService from '@/pages/legal/TermsOfService';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import Contact from '@/pages/support/Contact';
import FAQ from '@/pages/support/FAQ';

// Country pages
import CountryPage from '@/pages/countries/CountryPage';
import { AdminProtectedRoute } from '@/components/admin';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NetworkProvider>
          <LocaleProvider>
            <NotificationProvider>
              <HelmetProvider>
                <BrowserRouter>
                  <AppInitializer />
                  <SessionTimeout />
                  <Routes>
                    {/* Client Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/send" element={
                      <ProtectedRoute>
                        <SendMoney />
                      </ProtectedRoute>
                    } />
                    <Route path="/transactions" element={
                      <ProtectedRoute>
                        <TransactionHistory />
                      </ProtectedRoute>
                    } />
                    <Route path="/recipients" element={
                      <ProtectedRoute>
                        <Recipients />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <AdminProtectedRoute>
                        <AdminUsers />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/transactions" element={
                      <AdminProtectedRoute>
                        <AdminTransactions />
                      </AdminProtectedRoute>
                    } />
                    
                    {/* Footer Pages */}
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    
                    {/* Country Pages */}
                    <Route path="/country/:countryId" element={<CountryPage />} />
                    
                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </BrowserRouter>
              </HelmetProvider>
            </NotificationProvider>
          </LocaleProvider>
        </NetworkProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
