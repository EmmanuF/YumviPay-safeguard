
import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/toast/use-toast';
import LoadingState from '@/components/transaction/LoadingState';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading: authLoading, refreshAuthState, authError } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Better auth checking that prevents cascading state changes
  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking auth in ProtectedRoute for', location.pathname, 'isLoggedIn:', isLoggedIn);
      
      // If context already has authenticated user, use that
      if (isLoggedIn && !authLoading) {
        console.log('User is already logged in according to context, proceeding to protected content');
        setIsChecking(false);
        return;
      }
      
      // If auth is still loading, wait for it to complete
      if (authLoading) {
        console.log('Auth is still loading, waiting...');
        return;
      }
      
      // If auth has loaded and user is not logged in, refresh auth state once
      if (!isLoggedIn && !authLoading) {
        console.log('Auth loaded but user not logged in, refreshing auth state');
        try {
          await refreshAuthState();
        } catch (error) {
          console.error('Error refreshing auth state:', error);
        } finally {
          // Always mark checking as complete when done
          setIsChecking(false);
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsChecking(false);
      
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Failed to verify your login status",
        variant: "destructive",
      });
    }
  }, [authLoading, isLoggedIn, location.pathname, refreshAuthState]);
  
  useEffect(() => {
    let isMounted = true;
    
    const runAuthCheck = async () => {
      await checkAuth();
      // Only update state if component is still mounted
      if (isMounted) {
        setIsChecking(false);
      }
    };
    
    runAuthCheck();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [checkAuth]);
  
  // Add a timeout to prevent indefinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isChecking) {
        console.log('Auth check timeout reached, proceeding with current state');
        setIsChecking(false);
      }
    }, 3000); // 3 second timeout - reduced from 5 seconds for better UX
    
    return () => clearTimeout(timeoutId);
  }, [isChecking]);
  
  // Show loading state while checking authentication or while auth is loading
  if (authLoading || isChecking) {
    return (
      <LoadingState 
        message="Verifying authentication..." 
        submessage="Please wait while we check your login status" 
      />
    );
  }
  
  // Redirect to signin if not authenticated
  if (!isLoggedIn) {
    console.log('Not authenticated, redirecting to signin from', location.pathname);
    // Store the path they were trying to access
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }
  
  console.log('Authenticated, rendering protected content for', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
