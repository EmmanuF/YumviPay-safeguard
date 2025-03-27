import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getAuthState, 
  signInUser, 
  registerUser, 
  logoutUser 
} from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';
import { LAST_AUTH_CHECK_KEY, CACHED_AUTH_STATE_KEY, SESSION_EXPIRES_AT_KEY } from '@/services/auth/constants';

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
      
      // Add timeout protection for auth state refresh with increased timeout
      const authPromise = getAuthState();
      
      // Create a timeout promise with longer timeout (10 seconds)
      const timeoutPromise = new Promise<any>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Auth state refresh timed out'));
        }, 10000); // 10 seconds timeout
      });
      
      // Race the auth state refresh against the timeout
      const state = await Promise.race([authPromise, timeoutPromise]);
      
      console.log('Auth state refreshed:', state);
      
      // Store last auth state check timestamp
      localStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString());
      localStorage.setItem(CACHED_AUTH_STATE_KEY, state.isAuthenticated ? 'authenticated' : 'unauthenticated');
      
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: state.isAuthenticated,
        user: state.user,
        loading: false,
        authError: null
      }));
      
      return state;
    } catch (error: any) {
      console.error('Error refreshing auth state:', error);
      
      // Check if there's a stored auth state that's not too old (less than 5 minutes)
      const lastCheck = parseInt(localStorage.getItem(LAST_AUTH_CHECK_KEY) || '0');
      const isRecent = Date.now() - lastCheck < 30 * 60 * 1000; // 30 minutes - extended for better reliability
      
      if (isRecent) {
        console.log('Using cached auth state due to refresh error');
        // Keep existing state if the error is just a timeout and we have a recent check
        
        setAuthState(prev => ({
          ...prev,
          loading: false,
          authError: 'Temporary authentication service disruption. Using cached state.'
        }));
        
        return prev;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoggedIn: false,
          user: null,
          loading: false,
          authError: error instanceof Error ? error.message : 'Unknown authentication error'
        }));
        
        throw error;
      }
    }
  }, []);

  // Implement sign-in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const user = await signInUser(email, password);
      
      // After successful sign-in, immediately update the context state
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: true,
        user: user,
        authError: null
      }));
      
      // Then do a full refresh of the auth state
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
      
      // Immediately update state after successful registration
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: true,
        user: user,
        authError: null
      }));
      
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
      
      // Immediately update state to logged out
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: false,
        user: null,
        authError: null
      }));
      
      await logoutUser();
      await refreshAuthState();
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Initial auth state loading and auth state change listener
  useEffect(() => {
    console.log('Setting up auth provider...');
    let hasCompletedInitialLoad = false;
    
    const loadAuthState = async () => {
      try {
        await refreshAuthState();
        hasCompletedInitialLoad = true;
      } catch (error) {
        console.error('Error during initial auth state load:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          isLoggedIn: false
        }));
        hasCompletedInitialLoad = true;
      }
    };
    
    // Set up auth state change listener first
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      // Handle each event type appropriately
      if (event === 'SIGNED_IN') {
        console.log('User signed in, refreshing state');
        if (hasCompletedInitialLoad) {
          // Use setTimeout to prevent potential recursion issues with Supabase auth
          setTimeout(async () => {
            try {
              await refreshAuthState();
            } catch (error) {
              console.error('Error refreshing after sign in:', error);
            }
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, refreshing state');
        if (hasCompletedInitialLoad) {
          // Use setTimeout to prevent potential recursion issues
          setTimeout(async () => {
            try {
              // Clear any cached state
              localStorage.removeItem(LAST_AUTH_CHECK_KEY);
              localStorage.removeItem(CACHED_AUTH_STATE_KEY);
              localStorage.removeItem(SESSION_EXPIRES_AT_KEY);
              
              setAuthState(prev => ({
                ...prev,
                isLoggedIn: false,
                user: null
              }));
            } catch (error) {
              console.error('Error updating after sign out:', error);
            }
          }, 0);
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, updating state');
        
        // Store session duration information
        if (session) {
          const expiresAt = session.expires_at;
          if (expiresAt) {
            const expiresAtDate = new Date(expiresAt * 1000);
            console.log('Token expires at:', expiresAtDate.toISOString());
            localStorage.setItem(SESSION_EXPIRES_AT_KEY, expiresAtDate.toISOString());
          }
        }
        
        if (hasCompletedInitialLoad) {
          // Use setTimeout to prevent potential recursion issues
          setTimeout(async () => {
            try {
              await refreshAuthState();
            } catch (error) {
              console.error('Error refreshing after token refresh:', error);
            }
          }, 0);
        }
      }
    });
    
    // Then load the initial auth state
    loadAuthState();
    
    // Add a periodic refresh to ensure the token stays valid
    const refreshInterval = setInterval(() => {
      if (authState.isLoggedIn) {
        console.log('Periodic token refresh check');
        supabase.auth.refreshSession();
      }
    }, 10 * 60 * 1000); // Check every 10 minutes
    
    // Clean up the subscription and interval
    return () => {
      data.subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [refreshAuthState]);

  // Export the context value
  const contextValue = {
    ...authState,
    refreshAuthState,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
