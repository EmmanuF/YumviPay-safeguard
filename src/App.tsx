import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'sonner';

// Import components
import AppInitializer from './components/AppInitializer';
import PublicHome from './pages/PublicHome';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Security from './pages/Security';
import NotFound from './pages/NotFound';

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

// Import our new country status check page
import CheckCountriesStatus from './pages/admin/CheckCountriesStatus';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <title>Yumvi-Pay</title>
        <meta name="description" content="Send money internationally with ease" />
      </Helmet>
      
      <Router>
        <Toaster />
        <AppInitializer>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<NotFound />} />
            
            {/* App routes - Protected */}
            <Route path="/app" element={<ProtectedRoute />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="security" element={<Security />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminProtectedRoute />}>
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
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AppInitializer>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

// Simple protected route setup
function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('authToken'); // Example auth check
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

import { Outlet } from 'react-router-dom';
