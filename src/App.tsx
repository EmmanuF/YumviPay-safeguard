
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

import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import TransactionStatus from "./pages/TransactionStatus";
import NotFound from "./pages/NotFound";

// Initialize QueryClient with proper settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // For web platform, we can skip these mobile-specific operations
        if (typeof window !== 'undefined' && window.location.protocol.includes('http')) {
          setInitialRoute('/');
          return;
        }
        
        // For native mobile experience
        await SplashScreen.hide();
        await StatusBar.setStyle({ style: Style.Dark });
        
        // Set up keyboard behavior
        Keyboard.setAccessoryBarVisible({ isVisible: false });
        
        // Handle back button on Android
        CapApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapApp.exitApp();
          } else {
            window.history.back();
          }
        });
        
        // TODO: Check if user is authenticated and set initial route
        setInitialRoute('/');
      } catch (error) {
        console.error('Error initializing app:', error);
        setInitialRoute('/');
      }
    };

    initializeApp();

    return () => {
      // Clean up listeners
      if (typeof window !== 'undefined' && !window.location.protocol.includes('http')) {
        CapApp.removeAllListeners();
      }
    };
  }, []);

  // Wait until we've determined the initial route
  if (initialRoute === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/transaction/:id" element={<TransactionStatus />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
