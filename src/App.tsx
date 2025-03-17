import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/contexts/AuthContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { NetworkProvider } from '@/contexts/NetworkContext';

import MobileAppLayout from '@/components/MobileAppLayout';
import AppInitializer from '@/components/AppInitializer';
import ProtectedRoute from '@/components/ProtectedRoute';

import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import SendMoney from '@/pages/SendMoney';
import TransactionDetails from '@/pages/TransactionDetails';
import TransactionStatus from '@/pages/TransactionStatus';
import History from '@/pages/History';
import Recipients from '@/pages/Recipients';
import Profile from '@/pages/Profile';
import Analytics from '@/pages/Analytics';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <NetworkProvider>
            <LocaleProvider>
              <AppInitializer>
                <BrowserRouter>
                  <MobileAppLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/send" element={
                        <ProtectedRoute>
                          <SendMoney />
                        </ProtectedRoute>
                      } />
                      <Route path="/transaction/:id" element={
                        <ProtectedRoute>
                          <TransactionDetails />
                        </ProtectedRoute>
                      } />
                      <Route path="/transaction-status/:id" element={
                        <ProtectedRoute>
                          <TransactionStatus />
                        </ProtectedRoute>
                      } />
                      <Route path="/history" element={
                        <ProtectedRoute>
                          <History />
                        </ProtectedRoute>
                      } />
                      <Route path="/recipients" element={
                        <ProtectedRoute>
                          <Recipients />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      <Route path="/analytics" element={
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin" element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MobileAppLayout>
                </BrowserRouter>
              </AppInitializer>
              <Toaster />
            </LocaleProvider>
          </NetworkProvider>
        </AuthProvider>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
