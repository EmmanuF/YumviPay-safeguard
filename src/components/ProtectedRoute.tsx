
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LoadingState from '@/components/transaction/LoadingState';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading: authLoading, authError, refreshAuthState } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth in ProtectedRoute for', location.pathname);
        
        // Force a refresh of auth state to ensure we have the latest data
        await refreshAuthState();
        
        // If we already know the user is logged in from context, skip the check
        if (isLoggedIn && !authLoading) {
          console.log('User is already logged in according to context');
          setIsAuthenticated(true);
          setIsChecking(false);
          return;
        }
        
        // Check if we have cached authentication that's recent (within last 5 minutes)
        const lastAuthCheck = localStorage.getItem('lastAuthCheck');
        if (lastAuthCheck) {
          const lastChecked = parseInt(lastAuthCheck);
          const isRecent = Date.now() - lastChecked < 5 * 60 * 1000; // 5 minutes
          
          if (isRecent) {
            // Get cached session state
            const cachedAuthState = localStorage.getItem('cachedAuthState');
            if (cachedAuthState === 'authenticated') {
              console.log('Using cached authentication state (authenticated)');
              setIsAuthenticated(true);
              setIsChecking(false);
              return;
            }
          }
        }
        
        // Add a timeout for the authentication check with increased timeout
        const authCheckPromise = supabase.auth.getSession();
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Authentication check timed out'));
          }, 15000); // 15 seconds timeout (increased from 10)
        });
        
        // Race the auth check against the timeout
        const { data } = await Promise.race([
          authCheckPromise,
          timeoutPromise as Promise<any>
        ]);
        
        const isAuthValid = !!data.session;
        console.log('Auth check result:', isAuthValid ? 'Authenticated' : 'Not authenticated');
        
        // Cache the result
        localStorage.setItem('lastAuthCheck', Date.now().toString());
        localStorage.setItem('cachedAuthState', isAuthValid ? 'authenticated' : 'unauthenticated');
        
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
        
        // Check if the error is a timeout - in which case we can be more lenient
        if (error.message && error.message.includes('timed out')) {
          console.log('Auth check timed out, using last known state');
          
          // If we were previously authenticated and this is just a timeout,
          // give the benefit of the doubt and let the user continue
          const cachedAuthState = localStorage.getItem('cachedAuthState');
          const isRecentCache = !!localStorage.getItem('lastAuthCheck') && 
            (Date.now() - parseInt(localStorage.getItem('lastAuthCheck') || '0')) < 30 * 60 * 1000; // 30 minutes
          
          if (cachedAuthState === 'authenticated' && isRecentCache) {
            console.log('Using cached auth state due to timeout');
            setIsAuthenticated(true);
            
            toast({
              title: "Authentication Check Delayed",
              description: "Using cached login state. You may need to refresh if you encounter any issues.",
              variant: "default",
            });
          } else {
            setIsAuthenticated(false);
          }
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
    };
    
    checkAuth();
  }, [authError, toast, location.pathname, isLoggedIn, authLoading, refreshAuthState]);
  
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
