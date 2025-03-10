
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import Onboarding from '@/pages/Onboarding';
import SendMoney from '@/pages/SendMoney';
import History from '@/pages/History';
import TransactionDetails from '@/pages/TransactionDetails';
import Profile from '@/pages/Profile';
import { AuthProvider } from '@/contexts/AuthContext';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LocaleProvider } from './contexts/LocaleContext';
import { OfflineBanner } from '@/components/OfflineBanner';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocaleProvider>
          <NetworkProvider>
            <NotificationProvider>
              <div className="min-h-screen flex flex-col">
                <Toaster />
                <OfflineBanner />
                <Routes>
                  {/* Authentication routes */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  
                  {/* Main app routes */}
                  <Route path="/" element={<SendMoney />} />
                  <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                  <Route path="/transaction/:id" element={<ProtectedRoute><TransactionDetails /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                </Routes>
              </div>
            </NotificationProvider>
          </NetworkProvider>
        </LocaleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
