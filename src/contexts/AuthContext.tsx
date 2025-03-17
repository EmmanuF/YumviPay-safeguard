
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthState } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  isLoggedIn: boolean;
  user: any | null;
  loading: boolean;
  refreshAuthState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    isLoggedIn: false,
    user: null,
    loading: true,
    refreshAuthState: async () => {}
  });

  const refreshAuthState = async () => {
    try {
      const state = await getAuthState();
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: state.isAuthenticated,
        user: state.user,
        loading: false
      }));
    } catch (error) {
      console.error('Error refreshing auth state:', error);
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: false,
        user: null,
        loading: false
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
      await refreshAuthState();
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
