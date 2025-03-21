
import React, { useState, useEffect } from 'react';
import { useNetwork } from '@/contexts/network';
import { initializeSupabase } from '@/integrations/supabase/initializeSupabase';

const AppInitializer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { isOnline } = useNetwork();

  useEffect(() => {
    // Initialize the app when it loads
    const initApp = async () => {
      try {
        setIsAuthLoading(true);
        
        // Initialize Supabase client
        await initializeSupabase();
        
        // Initialize the country data
        const { initializeCountries } = await import('@/utils/initializeCountries');
        const { initializeSendingCountries } = await import('@/utils/initializeSendingCountries');
        const { resetCountryFlags } = await import('@/utils/resetSendingCountries');
        
        // Run country initialization functions
        await initializeCountries();
        await initializeSendingCountries();
        await resetCountryFlags();
        
        // Set app as initialized
        setIsInitialized(true);
        setIsAuthLoading(false);
        
        console.log('App initialization complete');
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsAuthLoading(false);
      }
    };

    initApp();
  }, []);

  if (isAuthLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export default AppInitializer;
