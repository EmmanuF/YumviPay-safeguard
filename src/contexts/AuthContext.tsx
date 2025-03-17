
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthState, signInUser, registerUser, logoutUser } from '@/services/auth';
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
      // For now we're not collecting phone or country during registration
      // These can be added later if needed
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
