import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { getAuthState } from '@/services/auth';
import { AuthState } from './types';
import { signInUser } from '@/services/auth/authLogin';
import { registerUser } from '@/services/auth/authRegister';
import { logoutUser } from '@/services/auth/authLogout';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    loading: true,
    authError: null,
  });

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    const initializeAuth = async () => {
      try {
        const authState = await getAuthState();
        console.log('AuthProvider: Got auth state:', 
          { isAuthenticated: authState.isAuthenticated });
        
        setState({
          isLoggedIn: authState.isAuthenticated,
          user: authState.user,
          loading: false,
          authError: null,
        });
      } catch (error) {
        console.error('Error initializing auth state:', error);
        setState({
          isLoggedIn: false,
          user: null,
          loading: false,
          authError: 'Failed to retrieve authentication state',
        });
      }
    };

    initializeAuth();
  }, []);

  const refreshAuthState = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const authState = await getAuthState();
      setState({
        isLoggedIn: authState.isAuthenticated,
        user: authState.user,
        loading: false,
        authError: null,
      });
    } catch (error) {
      console.error('Error refreshing auth state:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        authError: 'Failed to refresh authentication state',
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, authError: null }));
    try {
      const user = await signInUser(email, password);
      setState({
        isLoggedIn: true,
        user,
        loading: false,
        authError: null,
      });
      return user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        authError: error.message || 'Authentication failed',
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, loading: true, authError: null }));
    try {
      const user = await registerUser(name, email, '', 'CM', password);
      setState({
        isLoggedIn: true,
        user,
        loading: false,
        authError: null,
      });
      return user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        authError: error.message || 'Registration failed',
      }));
      throw error;
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await logoutUser();
      setState({
        isLoggedIn: false,
        user: null,
        loading: false,
        authError: null,
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        authError: error.message || 'Sign out failed',
      }));
      throw error;
    }
  };

  const value = {
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    loading: state.loading,
    refreshAuthState,
    authError: state.authError,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
