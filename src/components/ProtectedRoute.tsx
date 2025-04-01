
import React, { ReactNode, useState, useEffect } from 'react';
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
  
  // Using useEffect for auth checking to ensure consistent hook execution order
  useEffect(() => {
    console.log('ProtectedRoute: Running auth check effect for', location.pathname);
    let isMounted = true;
    
    const performAuthCheck = async () => {
      try {
        if (authLoading) {
          console.log('Auth is still loading, waiting...');
          return;
        }
        
        // If already logged in according to context, proceed
        if (isLoggedIn) {
          console.log('User is already logged in according to context, proceeding to protected content');
          if (isMounted) {
            setIsChecking(false);
            setShouldRedirect(false);
          }
          return;
        }
        
        // If not logged in, try refreshing auth state once
        console.log('Auth loaded but user not logged in, refreshing auth state');
        const authState = await refreshAuthState();
        
        if (isMounted) {
          setIsChecking(false);
          setShouldRedirect(!authState.isAuthenticated);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        if (isMounted) {
          setIsChecking(false);
          setShouldRedirect(true);
          
          toast({
            title: "Authentication Error",
            description: error instanceof Error ? error.message : "Failed to verify your login status",
            variant: "destructive",
          });
        }
      }
    };
    
    performAuthCheck();
    
    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [authLoading, isLoggedIn, location.pathname, refreshAuthState, toast]);
  
  // Render based on current state - no early returns or conditionals that could affect hook order
  if (authLoading || isChecking) {
    return (
      <LoadingState 
        message="Verifying authentication..." 
        submessage="Please wait while we check your login status" 
      />
    );
  }
  
  if (!isLoggedIn && !isChecking) {
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
