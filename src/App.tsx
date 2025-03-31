import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import SessionTimeout from '@/components/security/SessionTimeout';
import AppInitializer from '@/components/AppInitializer';
import { AuthProvider } from '@/contexts/auth';

// Import existing pages
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Transactions from '@/pages/Transactions';
import Settings from '@/pages/Settings';
import Onboarding from '@/pages/Onboarding';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import { useAuth } from '@/contexts/auth';

// Import the ResetPassword page
import ResetPassword from '@/pages/ResetPassword';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="yumvi-pay-theme">
        <AuthProvider>
          <AppInitializer />
          <SessionTimeout timeout={3 * 60 * 60 * 1000} warningTime={10 * 60 * 1000} />
          <Routes>
            <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/onboarding" element={<PublicRoute><Onboarding /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
