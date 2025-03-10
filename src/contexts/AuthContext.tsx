
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthState } from '@/services/auth';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const state = await getAuthState();
        console.log('Auth state loaded:', state);
        setAuthState({
          isLoggedIn: state.isAuthenticated,
          user: state.user,
          loading: false
        });
        
        // If not authenticated and not on auth pages, redirect to signin
        if (!state.isAuthenticated && 
            !location.pathname.includes('/signin') && 
            !location.pathname.includes('/signup') && 
            !location.pathname.includes('/onboarding')) {
          console.log('Redirecting to signin due to no authentication');
          navigate('/signin');
        }
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
  }, [location.pathname, navigate]);

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
