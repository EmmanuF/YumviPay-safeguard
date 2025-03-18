import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getAuthState, 
  signInUser, 
  registerUser, 
  logoutUser 
} from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';
import { showErrorToast } from '@/utils/errorHandling';

type AuthContextType = {
  isLoggedIn: boolean;
  user: any | null;
  loading: boolean;
  refreshAuthState: () => Promise<void>;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    isLoggedIn: false,
    user: null,
    loading: true,
    refreshAuthState: async () => {},
    authError: null,
    signIn: async () => ({}),
    signUp: async () => ({}),
    signOut: async () => {}
  });

  const refreshAuthState = useCallback(async () => {
    try {
      console.log('Refreshing auth state...');
      
      // Check if we have a cached state first for faster UI response
      const cachedState = localStorage.getItem('cachedAuthState');
      const lastAuthCheck = localStorage.getItem('lastAuthCheck');
      
      if (cachedState && lastAuthCheck) {
        const parsedState = JSON.parse(cachedState);
        const lastCheck = parseInt(lastAuthCheck);
        const isRecent = Date.now() - lastCheck < 5 * 60 * 1000; // 5 minutes
        
        if (isRecent && parsedState.isAuthenticated) {
          console.log('Using cached auth state (quick response)');
          setAuthState(prev => ({
            ...prev,
            isLoggedIn: parsedState.isAuthenticated,
            user: parsedState.user,
            loading: false,
            authError: null
          }));
        }
      }
      
      // Add timeout protection for auth state refresh with increased timeout
      const authPromise = getAuthState();
      
      // Create a timeout promise with longer timeout (30 seconds)
      const timeoutPromise = new Promise<any>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Auth state refresh timed out'));
        }, 30000); // 30 seconds timeout (increased from 20)
      });
      
      // Race the auth state refresh against the timeout
      const state = await Promise.race([authPromise, timeoutPromise]);
      
      console.log('Auth state refreshed:', state);
      
      // Cache the auth state
      localStorage.setItem('cachedAuthState', JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }));
      
      // Store last auth state check timestamp
      localStorage.setItem('lastAuthCheck', Date.now().toString());
      
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: state.isAuthenticated,
        user: state.user,
        loading: false,
        authError: null
      }));
    } catch (error: any) {
      console.error('Error refreshing auth state:', error);
      
      // Check if there's a stored auth state that's not too old (less than 15 minutes)
      const lastCheck = parseInt(localStorage.getItem('lastAuthCheck') || '0');
      const isRecent = Date.now() - lastCheck < 15 * 60 * 1000; // 15 minutes (increased from 5)
      const cachedState = localStorage.getItem('cachedAuthState');
      
      if (isRecent && cachedState) {
        console.log('Using cached auth state due to refresh error');
        // Keep existing state if the error is just a timeout and we have a recent check
        const parsedState = JSON.parse(cachedState);
        
        setAuthState(prev => ({
          ...prev,
          isLoggedIn: parsedState.isAuthenticated,
          user: parsedState.user,
          loading: false,
          authError: 'Temporary authentication service disruption. Using cached state.'
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoggedIn: false,
          user: null,
          loading: false,
          authError: error instanceof Error ? error.message : 'Unknown authentication error'
        }));
      }
    }
  }, []);

  // Implement sign-in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const user = await signInUser(email, password);
      await refreshAuthState();
      return user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Implement sign-up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Registering user:', email);
      const user = await registerUser(name, email, '', '', password);
      await refreshAuthState();
      return user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  // Implement sign-out function
  const signOut = async () => {
    try {
      console.log('Signing out user');
      await logoutUser();
      // Clear cached auth state
      localStorage.setItem('cachedAuthState', JSON.stringify({
        isAuthenticated: false,
        user: null
      }));
      await refreshAuthState();
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
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
        
        // Store session duration information
        if (session) {
          const expiresAt = session.expires_at;
          if (expiresAt) {
            const expiresAtDate = new Date(expiresAt * 1000);
            console.log('Token expires at:', expiresAtDate.toISOString());
            
            // Store expiration in localStorage for more visibility
            localStorage.setItem('sessionExpiresAt', expiresAtDate.toISOString());
          }
        }
        
        await refreshAuthState();
      }
    });
    
    // Add a more frequent periodic refresh to ensure the token stays valid
    const refreshInterval = setInterval(() => {
      if (authState.isLoggedIn) {
        console.log('Periodic token refresh check');
        supabase.auth.refreshSession();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes (reduced from 10)
    
    // Clean up the subscription and interval
    return () => {
      data.subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [authState.isLoggedIn, refreshAuthState]);

  return (
    <AuthContext.Provider value={{
      ...authState,
      refreshAuthState,
      signIn,
      signUp,
      signOut
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
