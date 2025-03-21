
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/contexts/network';
import { initializeSupabase } from '@/integrations/supabase/initializeSupabase';
import { initializeApp } from '@/utils/initializeApp';

const AppInitializer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { isOnline } = useNetwork();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    // Initialize the app when it loads
    const initApp = async () => {
      try {
        setIsAuthLoading(true);
        
        console.log('Starting app initialization...');
        
        // Initialize Supabase client
        await initializeSupabase();
        
        // Initialize the app (includes country data)
        await initializeApp();
        
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

  if (isAuthLoading || authLoading || !isInitialized) {
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
