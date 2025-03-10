
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

import { NotificationProvider } from "@/contexts/NotificationContext";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { OfflineBanner } from "@/components/OfflineBanner";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import History from "./pages/History";
import Recipients from "./pages/Recipients";
import TransactionStatus from "./pages/TransactionStatus";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Configure React Query with offline-friendly settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Add error handling for all queries
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      // Add error handling for all mutations
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    }
  },
});

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // For web browsers, skip native device initialization
        if (typeof window !== 'undefined' && window.location.protocol.includes('http')) {
          setInitialRoute('/');
          setAppReady(true);
          return;
        }
        
        // Mobile device initialization
        try {
          await SplashScreen.hide();
          await StatusBar.setStyle({ style: Style.Dark });
          Keyboard.setAccessoryBarVisible({ isVisible: false });
        } catch (deviceError) {
          console.warn('Device API error (non-critical):', deviceError);
        }
        
        // Add back button listener for Android
        try {
          CapApp.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
              CapApp.exitApp();
            } else {
              window.history.back();
            }
          });
        } catch (listenerError) {
          console.warn('Back button listener error (non-critical):', listenerError);
        }
        
        setInitialRoute('/');
        setAppReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to ensure the app loads even if there's an error
        setInitialRoute('/');
        setAppReady(true);
      }
    };

    initializeApp();

    return () => {
      // Cleanup listener on component unmount
      if (typeof window !== 'undefined' && 
          !window.location.protocol.includes('http') && 
          CapApp && 
          typeof CapApp.removeAllListeners === 'function') {
        try {
          CapApp.removeAllListeners();
        } catch (error) {
          console.warn('Error removing listeners:', error);
        }
      }
    };
  }, []);

  // Show a simple loading state while initializing
  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary">Loading application...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <NetworkProvider queryClient={queryClient}>
            <Toaster />
            <Sonner />
            <OfflineBanner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/send" element={<SendMoney />} />
                <Route path="/history" element={<History />} />
                <Route path="/recipients" element={<Recipients />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/transaction/:id" element={<TransactionStatus />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NetworkProvider>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
