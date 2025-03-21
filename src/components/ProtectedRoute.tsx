
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
  const { isLoggedIn, loading: authLoading, authError } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth in ProtectedRoute for', location.pathname);
        
        // If we already know the user is logged in from context, skip the check
        if (isLoggedIn && !authLoading) {
          console.log('User is already logged in according to context');
          setIsAuthenticated(true);
          setIsChecking(false);
          return;
        }
        
        // Use a simple approach first - try getting the session
        try {
          console.log('Getting current session...');
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            setIsAuthenticated(false);
          } else {
            console.log('Session retrieved successfully, authenticated:', !!data.session);
            setIsAuthenticated(!!data.session);
          }
        } catch (sessionError) {
          console.error('Failed to get session:', sessionError);
          setIsAuthenticated(false);
        }
        
        // Regardless of the result, allow the component to render
        setIsChecking(false);
      } catch (error: any) {
        console.error('Error in auth check:', error);
        setIsAuthenticated(false);
        setIsChecking(false);
        
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to verify your login status. Please try signing in again.",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, [authError, toast, location.pathname, isLoggedIn, authLoading]);
  
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
