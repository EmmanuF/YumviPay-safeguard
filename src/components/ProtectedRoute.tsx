
import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/components/ui/use-toast';
import LoadingState from '@/components/transaction/LoadingState';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading: authLoading, refreshAuthState, authError } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { toast } = useToast();
  
  // Simplified auth checking that reduces redundant API calls
  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking auth in ProtectedRoute for', location.pathname, 'isLoggedIn:', isLoggedIn);
      
      // If context already has authenticated user, use that
      if (isLoggedIn && !authLoading) {
        console.log('User is already logged in according to context, proceeding to protected content');
        setIsChecking(false);
        setShouldRedirect(false);
        return;
      }
      
      // If auth is still loading, wait for it
      if (authLoading) {
        console.log('Auth is still loading, waiting...');
        return;
      }
      
      // If auth has loaded and user is not logged in, refresh auth state once
      if (!isLoggedIn && !authLoading) {
        console.log('Auth loaded but user not logged in, refreshing auth state');
        await refreshAuthState();
        setIsChecking(false);
        
        // After refresh, if still not logged in, redirect
        if (!isLoggedIn) {
          setShouldRedirect(true);
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsChecking(false);
      setShouldRedirect(true);
      
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Failed to verify your login status",
        variant: "destructive",
      });
    }
  }, [authLoading, isLoggedIn, location.pathname, refreshAuthState, toast]);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth, authLoading, isLoggedIn]);
  
  // Use JSX conditionals rather than early returns to maintain hook consistency
  return (
    <>
      {(authLoading || isChecking) && (
        <LoadingState 
          message="Verifying authentication..." 
          submessage="Please wait while we check your login status" 
        />
      )}
      
      {!authLoading && !isChecking && shouldRedirect && (
        <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />
      )}
      
      {!authLoading && !isChecking && !shouldRedirect && isLoggedIn && (
        <>{children}</>
      )}
    </>
  );
};

export default ProtectedRoute;
