
import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LoadingState from '@/components/transaction/LoadingState';
import { LAST_AUTH_CHECK_KEY, CACHED_AUTH_STATE_KEY } from '@/services/auth/constants';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading: authLoading, refreshAuthState, authError } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  // Memoize the checkAuth function to avoid recreating it on every render
  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking auth in ProtectedRoute for', location.pathname);
      
      // If we already know the user is logged in from context, trust it
      if (isLoggedIn && !authLoading) {
        console.log('User is already logged in according to context');
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }
      
      // Check if we have cached authentication that's recent (within last 10 minutes)
      const lastAuthCheck = localStorage.getItem(LAST_AUTH_CHECK_KEY);
      if (lastAuthCheck) {
        const lastChecked = parseInt(lastAuthCheck);
        const isRecent = Date.now() - lastChecked < 10 * 60 * 1000; // 10 minutes
        
        if (isRecent) {
          // Get cached session state
          const cachedAuthState = localStorage.getItem(CACHED_AUTH_STATE_KEY);
          if (cachedAuthState === 'authenticated') {
            console.log('Using cached authentication state (authenticated)');
            setIsAuthenticated(true);
            setIsChecking(false);
            
            // Refresh auth state in the background, but don't wait for it
            refreshAuthState().catch(err => {
              console.warn('Background auth refresh failed:', err);
            });
            
            return;
          }
        }
      }
      
      // Create a timeout that resolves after 5 seconds
      const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) => {
        setTimeout(() => {
          resolve({ data: { session: null } });
        }, 5000); // 5 seconds timeout
      });
      
      // Race the auth check against the timeout
      const { data } = await Promise.race([
        supabase.auth.getSession(),
        timeoutPromise
      ]);
      
      const isAuthValid = !!data.session;
      console.log('Auth check result:', isAuthValid ? 'Authenticated' : 'Not authenticated');
      
      // Cache the result
      localStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString());
      localStorage.setItem(CACHED_AUTH_STATE_KEY, isAuthValid ? 'authenticated' : 'unauthenticated');
      
      if (isAuthValid) {
        // Force a context refresh to ensure it's in sync
        await refreshAuthState();
      }
      
      setIsAuthenticated(isAuthValid);
      
      if (!isAuthValid && authError) {
        console.error('Authentication error:', authError);
        toast({
          title: "Authentication Error",
          description: authError,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error checking authentication:', error);
      
      // Check if we have any cached auth state we can use
      const cachedAuthState = localStorage.getItem(CACHED_AUTH_STATE_KEY);
      const lastCheck = parseInt(localStorage.getItem(LAST_AUTH_CHECK_KEY) || '0');
      const isRecentCache = lastCheck && (Date.now() - lastCheck < 60 * 60 * 1000); // 60 minutes
      
      if (cachedAuthState === 'authenticated' && isRecentCache) {
        console.log('Using cached auth state due to error');
        setIsAuthenticated(true);
        
        toast({
          title: "Using Cached Login",
          description: "We're having trouble connecting to the authentication service. Using your previous login for now.",
          variant: "default",
        });
      } else {
        setIsAuthenticated(false);
        
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to verify your login status. Please try signing in again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsChecking(false);
    }
  }, [authError, toast, location.pathname, isLoggedIn, authLoading, refreshAuthState]);
  
  // Check auth when the component mounts or when dependencies change
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Listen for auth state changes from Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in ProtectedRoute:', event);
      
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Show loading state while checking authentication
  if (authLoading || isChecking) {
    return <LoadingState 
      message="Verifying authentication..." 
      submessage="Please wait while we check your login status" 
    />;
  }
  
  if (!isLoggedIn && !isAuthenticated) {
    console.log('Not authenticated, redirecting to signin from', location.pathname);
    // Store the current path to redirect back after login
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }
  
  console.log('Authenticated, rendering protected content for', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
