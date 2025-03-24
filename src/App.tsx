
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from '@/contexts/AuthContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { HelmetProvider } from 'react-helmet-async';
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

// Footer pages
import AboutUs from '@/pages/company/AboutUs';
import TermsOfService from '@/pages/legal/TermsOfService';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import Contact from '@/pages/support/Contact';
import FAQ from '@/pages/support/FAQ';

// Country pages
import CountryPage from '@/pages/countries/CountryPage';

// Transaction pages
import TransactionStatus from '@/pages/TransactionStatus';
import TransactionDetails from '@/pages/TransactionDetails';

// Debug tools
import KadoConnectionDebugger from '@/components/kado/KadoConnectionDebugger';

function App() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <LocaleProvider>
          <NotificationProvider>
            <HelmetProvider>
              <BrowserRouter>
                <AppInitializer />
                <SessionTimeout />
                <Routes>
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
                  
                  {/* Transaction Routes */}
                  <Route path="/transaction/:transactionId" element={
                    <ProtectedRoute>
                      <TransactionDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/transaction/new" element={
                    <ProtectedRoute>
                      <TransactionStatus />
                    </ProtectedRoute>
                  } />
                  
                  {/* Debug Routes */}
                  <Route path="/debug/kado" element={<KadoConnectionDebugger />} />
                  
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
                <SonnerToaster position="top-center" richColors closeButton />
              </BrowserRouter>
            </HelmetProvider>
          </NotificationProvider>
        </LocaleProvider>
      </NetworkProvider>
    </AuthProvider>
  );
}

export default App;
