
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from '@/contexts/auth'; 
import { NetworkProvider } from '@/contexts/NetworkContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { HelmetProvider } from 'react-helmet-async';
import AppInitializer from '@/components/AppInitializer';
import MobileAppLayout from '@/components/MobileAppLayout';
import './App.css';

// Core pages
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import SendMoney from '@/pages/SendMoney';
import TransactionHistory from '@/pages/TransactionHistory';
import Recipients from '@/pages/Recipients';
import Referral from '@/pages/Referral';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import SessionTimeout from '@/components/security/SessionTimeout';

// Footer pages - Company
import AboutUs from '@/pages/company/AboutUs';
import Careers from '@/pages/company/Careers';
import Press from '@/pages/company/Press';
import Blog from '@/pages/company/Blog';

// Footer pages - Legal
import TermsOfService from '@/pages/legal/TermsOfService';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import Security from '@/pages/legal/Security';
import Compliance from '@/pages/legal/Compliance';
import Cookies from '@/pages/legal/Cookies';

// Footer pages - Support
import Contact from '@/pages/support/Contact';
import FAQ from '@/pages/support/FAQ';
import Support from '@/pages/support/Support';

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
                  {/* Primary Routes */}
                  <Route path="/" element={
                    <MobileAppLayout>
                      <Home />
                    </MobileAppLayout>
                  } />
                  <Route path="/signin" element={
                    <MobileAppLayout hideFooter>
                      <SignIn />
                    </MobileAppLayout>
                  } />
                  <Route path="/signup" element={
                    <MobileAppLayout hideFooter>
                      <SignUp />
                    </MobileAppLayout>
                  } />
                  {/* Redirect dashboard to history */}
                  <Route path="/dashboard" element={
                    <Navigate to="/history" replace />
                  } />
                  
                  {/* Protected Routes */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <MobileAppLayout>
                        <Profile />
                      </MobileAppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/send" element={
                    <ProtectedRoute>
                      <MobileAppLayout>
                        <SendMoney />
                      </MobileAppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <MobileAppLayout>
                        <TransactionHistory />
                      </MobileAppLayout>
                    </ProtectedRoute>
                  } />
                  {/* Make history the main transactions page */}
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <MobileAppLayout>
                        <TransactionHistory />
                      </MobileAppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/recipients" element={
                    <ProtectedRoute>
                      <MobileAppLayout>
                        <Recipients />
                      </MobileAppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/referral" element={
                    <ProtectedRoute>
                      <MobileAppLayout>
                        <Referral />
                      </MobileAppLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Transaction Routes */}
                  <Route path="/transaction/:transactionId" element={
                    <ProtectedRoute>
                      <MobileAppLayout>
                        <TransactionDetails />
                      </MobileAppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/transaction/new" element={
                    <ProtectedRoute>
                      <MobileAppLayout>
                        <TransactionStatus />
                      </MobileAppLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Debug Routes */}
                  <Route path="/debug/kado" element={
                    <MobileAppLayout>
                      <KadoConnectionDebugger />
                    </MobileAppLayout>
                  } />
                  
                  {/* Footer Pages - Using a single layout wrapper */}
                  {/* Company pages */}
                  <Route path="/about" element={<MobileAppLayout><AboutUs /></MobileAppLayout>} />
                  <Route path="/careers" element={<MobileAppLayout><Careers /></MobileAppLayout>} />
                  <Route path="/press" element={<MobileAppLayout><Press /></MobileAppLayout>} />
                  <Route path="/blog" element={<MobileAppLayout><Blog /></MobileAppLayout>} />
                  
                  {/* Legal pages */}
                  <Route path="/terms" element={<MobileAppLayout><TermsOfService /></MobileAppLayout>} />
                  <Route path="/privacy" element={<MobileAppLayout><PrivacyPolicy /></MobileAppLayout>} />
                  <Route path="/security" element={<MobileAppLayout><Security /></MobileAppLayout>} />
                  <Route path="/compliance" element={<MobileAppLayout><Compliance /></MobileAppLayout>} />
                  <Route path="/cookies" element={<MobileAppLayout><Cookies /></MobileAppLayout>} />
                  
                  {/* Support pages */}
                  <Route path="/contact" element={<MobileAppLayout><Contact /></MobileAppLayout>} />
                  <Route path="/faq" element={<MobileAppLayout><FAQ /></MobileAppLayout>} />
                  <Route path="/support" element={<MobileAppLayout><Support /></MobileAppLayout>} />
                  
                  {/* Country Pages */}
                  <Route path="/country/:countryId" element={<MobileAppLayout><CountryPage /></MobileAppLayout>} />
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<MobileAppLayout><NotFound /></MobileAppLayout>} />
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
