
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

// Import components
import AppInitializer from './components/AppInitializer';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import SendMoney from './pages/SendMoney';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Recipients from './pages/Recipients';
import TransactionHistory from './pages/TransactionHistory';
import TransactionStatus from './pages/TransactionStatus';
import TransactionDetails from './pages/TransactionDetails';
import TransactionNew from './pages/TransactionNew';

// Import admin components and routes
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCountries from './pages/admin/AdminCountries';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminCMS from './pages/admin/AdminCMS';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSecurity from './pages/admin/AdminSecurity';
import CheckCountriesStatus from './pages/admin/CheckCountriesStatus';

// Import providers
import { NetworkProvider } from './contexts/network';
import { AuthProvider } from './contexts/AuthContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NetworkProvider>
          <LocaleProvider>
            <HelmetProvider>
              <Router>
                <Toaster />
                <AppInitializer>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/send" element={<SendMoney />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* Transaction routes */}
                    <Route path="/transaction/new" element={<TransactionNew />} />
                    <Route path="/transaction/:id" element={<TransactionDetails />} />
                    <Route path="/transaction/:id/status" element={<TransactionStatus />} />
                    <Route path="/transactions" element={<TransactionHistory />} />
                    <Route path="/recipients" element={<Recipients />} />
                    
                    {/* App routes - Protected */}
                    <Route path="/app" element={<ProtectedRoute />}>
                      <Route index element={<Navigate to="/app/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="profile" element={<Profile />} />
                    </Route>
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminProtectedRouteWrapper />}>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="countries" element={<AdminCountries />} />
                      <Route path="countries-status" element={<CheckCountriesStatus />} />
                      <Route path="transactions" element={<AdminTransactions />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="cms" element={<AdminCMS />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="security" element={<AdminSecurity />} />
                    </Route>
                    
                    {/* 404 route - Must be placed after all other routes */}
                    <Route path="/404" element={<NotFound />} />
                    
                    {/* Catch-all route - Must be last */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppInitializer>
              </Router>
            </HelmetProvider>
          </LocaleProvider>
        </NetworkProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

// Simple protected route setup
function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('authToken'); // Example auth check
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

// Wrapper for AdminProtectedRoute to provide children prop
function AdminProtectedRouteWrapper() {
  return (
    <AdminProtectedRoute>
      <Outlet />
    </AdminProtectedRoute>
  );
}

export default App;
