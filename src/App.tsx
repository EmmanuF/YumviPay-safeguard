
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NetworkProvider, OfflineBanner } from '@/contexts/NetworkContext';
import { AnimatePresence } from 'framer-motion';
import Onboarding from '@/pages/Onboarding';
import SendMoney from '@/pages/SendMoney';
import History from '@/pages/History';
import TransactionDetails from '@/pages/TransactionDetails';
import BottomNavigation from '@/components/BottomNavigation';
import Profile from '@/pages/Profile';
import { useNetwork } from '@/contexts/NetworkContext';
import { initializeCountries } from '@/utils/initializeCountries';
import { useAuth } from '@/contexts/AuthContext';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect } from 'react';

// Add locale provider import
import { LocaleProvider } from './contexts/LocaleContext';

function App() {
  const { isOffline } = useNetwork();
  const queryClient = new QueryClient();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Initialize countries in Supabase on app load
    initializeCountries();
  }, []);

  return (
    <NetworkProvider>
      <LocaleProvider>
        <div className="min-h-screen flex flex-col">
          <NotificationProvider>
            <AnimatePresence>
              {isOffline && <OfflineBanner />}
            </AnimatePresence>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/transaction/:id" element={<ProtectedRoute><TransactionDetails /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Routes>
            </QueryClientProvider>
          </NotificationProvider>
        </div>
      </LocaleProvider>
    </NetworkProvider>
  );
}

export default App;
