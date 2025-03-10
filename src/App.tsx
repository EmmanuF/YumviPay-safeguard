
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';

// Pages
import Dashboard from '@/pages/Dashboard';
import History from '@/pages/History';
import Index from '@/pages/Index';
import Onboarding from '@/pages/Onboarding';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Recipients from '@/pages/Recipients';
import SendMoney from '@/pages/SendMoney';
import TransactionStatus from '@/pages/TransactionStatus';
import Auth from '@/pages/Auth';

// Contexts
import { NetworkContextProvider } from '@/contexts/NetworkContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthenticated(!!data.session);
      setLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return authenticated ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <BrowserRouter>
      <NetworkContextProvider>
        <NotificationProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/recipients" element={
              <ProtectedRoute><Recipients /></ProtectedRoute>
            } />
            <Route path="/send" element={
              <ProtectedRoute><SendMoney /></ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute><History /></ProtectedRoute>
            } />
            <Route path="/transaction/:id" element={
              <ProtectedRoute><TransactionStatus /></ProtectedRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
        </NotificationProvider>
      </NetworkContextProvider>
    </BrowserRouter>
  );
}

export default App;
