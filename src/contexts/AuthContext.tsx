
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthState } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';
import { showErrorToast } from '@/utils/errorHandling';

type AuthContextType = {
  isLoggedIn: boolean;
  user: any | null;
  loading: boolean;
  refreshAuthState: () => Promise<void>;
  authError: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    isLoggedIn: false,
    user: null,
    loading: true,
    refreshAuthState: async () => {},
    authError: null
  });

  const refreshAuthState = async () => {
    try {
      console.log('Refreshing auth state...');
      
      // Add timeout protection for auth state refresh
      const authPromise = getAuthState();
      
      // Create a timeout promise
      const timeoutPromise = new Promise<any>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Auth state refresh timed out'));
        }, 10000); // 10 seconds timeout
      });
      
      // Race the auth state refresh against the timeout
      const state = await Promise.race([authPromise, timeoutPromise]);
      
      console.log('Auth state refreshed:', state);
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: state.isAuthenticated,
        user: state.user,
        loading: false,
        authError: null
      }));
    } catch (error: any) {
      console.error('Error refreshing auth state:', error);
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: false,
        user: null,
        loading: false,
        authError: error instanceof Error ? error.message : 'Unknown authentication error'
      }));
    }
  };

  useEffect(() => {
    const loadAuthState = async () => {
      await refreshAuthState();
    };
    
    loadAuthState();
    
    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in, refreshing state');
        await refreshAuthState();
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, refreshing state');
        await refreshAuthState();
      } else if (event === 'USER_UPDATED') {
        console.log('User updated, refreshing state');
        await refreshAuthState();
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery initiated');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, updating state');
        await refreshAuthState();
      }
    });
    
    // Clean up the subscription
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      refreshAuthState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
