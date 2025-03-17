
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import PageTransition from '@/components/PageTransition';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Dashboard from '@/pages/Dashboard';
import SendMoney from '@/pages/SendMoney';
import Recipients from '@/pages/Recipients';
import History from '@/pages/History';
import TransactionDetails from '@/pages/TransactionDetails';
import TransactionStatus from '@/pages/TransactionStatus';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import Onboarding from '@/pages/Onboarding';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import MobileAppLayout from '@/components/MobileAppLayout';
import { SplashScreen } from '@capacitor/splash-screen';
import { deepLinkService } from '@/services/deepLinkService';
import { isPlatform } from '@/utils/platformUtils';
import './App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Hide the splash screen with a fade animation
    SplashScreen.hide({
      fadeOutDuration: 300
    }).catch(error => {
      console.error('Error hiding splash screen:', error);
    });
    
    // Set up deep link handling
    if (isPlatform('mobile')) {
      // Add a listener for deep links
      const removeListener = deepLinkService.addListener((url) => {
        try {
          console.log('Deep link received in App.tsx:', url);
          
          // Parse the deep link URL
          const { path, params } = deepLinkService.parseDeepLink(url);
          
          if (path) {
            // Navigate to the appropriate route
            navigate(`/${path}`, { 
              state: { 
                source: params.source,
                ...params 
              } 
            });
            
            console.log(`Navigated to /${path} with params:`, params);
          }
        } catch (error) {
          console.error('Error handling deep link:', error);
        }
      });
      
      // Clean up listener when component unmounts
      return () => removeListener();
    }
  }, [navigate]);
  
  return (
    <AuthProvider>
      <LocaleProvider>
        <NetworkProvider>
          <MobileAppLayout>
            <Routes location={location}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/signin" element={<PageTransition><SignIn /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <PageTransition><Onboarding /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/send/*" element={
                <ProtectedRoute>
                  <PageTransition><SendMoney /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/recipients" element={
                <ProtectedRoute>
                  <PageTransition><Recipients /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <PageTransition><History /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/transaction/:id" element={
                <ProtectedRoute>
                  <PageTransition><TransactionDetails /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/transaction/status/:id" element={
                <ProtectedRoute>
                  <PageTransition><TransactionStatus /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <PageTransition><Profile /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors />
          </MobileAppLayout>
        </NetworkProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}

export default App;
