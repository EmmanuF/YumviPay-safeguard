
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/contexts/network';
import { initializeSupabase } from '@/integrations/supabase/initializeSupabase';
import { initializeApp } from '@/utils/initializeApp';
import { toast } from 'sonner';

const AppInitializer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<Error | null>(null);
  const { isOnline } = useNetwork();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    // Initialize the app when it loads
    const initApp = async () => {
      try {
        setIsInitializing(true);
        setInitError(null);
        
        console.log('Starting app initialization...');
        
        // Initialize Supabase client
        await initializeSupabase();
        
        // Initialize the app (includes country data)
        await initializeApp();
        
        // Set app as initialized
        setIsInitialized(true);
        setIsInitializing(false);
        
        console.log('App initialization complete');
      } catch (error) {
        console.error('Error initializing app:', error);
        setInitError(error instanceof Error ? error : new Error('Unknown initialization error'));
        setIsInitializing(false);
        
        // Show error toast
        toast.error('Failed to initialize app. Some features may not work correctly.', {
          duration: 5000,
          action: {
            label: 'Retry',
            onClick: () => initApp()
          }
        });
      }
    };

    initApp();
  }, []);

  // Show loading state while initializing or auth is loading
  if (isInitializing || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <span className="loading loading-dots loading-lg"></span>
        <p className="text-sm text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initError && !isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 gap-4">
        <div className="bg-destructive/10 p-4 rounded-md max-w-md text-center">
          <h2 className="font-semibold mb-2">Application Error</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {initError.message || 'Failed to initialize the application'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  // Render children once initialized
  return <>{children}</>;
};

export default AppInitializer;
