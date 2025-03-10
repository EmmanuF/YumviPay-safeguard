
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthState } from '@/services/auth';

type AuthContextType = {
  isLoggedIn: boolean;
  user: any | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    isLoggedIn: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState({
          isLoggedIn: state.isAuthenticated,
          user: state.user,
          loading: false
        });
      } catch (error) {
        console.error('Error loading auth state:', error);
        setAuthState({
          isLoggedIn: false,
          user: null,
          loading: false
        });
      }
    };
    
    loadAuthState();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
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
