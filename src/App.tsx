import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
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
import TransactionNew from '@/pages/TransactionNew';
import TransactionStatus from '@/pages/TransactionStatus';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminCountries from '@/pages/admin/AdminCountries';
import AdminReports from '@/pages/admin/AdminReports';
import AdminSecurity from '@/pages/admin/AdminSecurity';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminCMS from '@/pages/admin/AdminCMS';
import CountriesManagement from '@/pages/admin/CountriesManagement';

// Footer pages
import AboutUs from '@/pages/company/AboutUs';
import TermsOfService from '@/pages/legal/TermsOfService';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import Contact from '@/pages/support/Contact';
import FAQ from '@/pages/support/FAQ';

// Country pages
import CountryPage from '@/pages/countries/CountryPage';
import { AdminProtectedRoute } from '@/components/admin';

const App: React.FC = () => {
  console.log('App component rendering');
  return (
    <NetworkProvider>
      <AuthProvider>
        <LocaleProvider>
          <HelmetProvider>
            <Router>
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
                
                {/* Transaction Routes */}
                <Route path="/transaction/new" element={
                  <ProtectedRoute>
                    <TransactionNew />
                  </ProtectedRoute>
                } />
                <Route path="/transaction/:transactionId" element={
                  <ProtectedRoute>
                    <TransactionStatus />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <Outlet />
                  </AdminProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="countries" element={<CountriesManagement />} />
                  <Route path="cms" element={<AdminCMS />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="security" element={<AdminSecurity />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                
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
            </Router>
          </HelmetProvider>
        </LocaleProvider>
      </AuthProvider>
    </NetworkProvider>
  );
};

export default App;
