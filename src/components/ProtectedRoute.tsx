
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading, authError } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth in ProtectedRoute');
        const { data } = await supabase.auth.getSession();
        const isAuthValid = !!data.session;
        console.log('Auth check result:', isAuthValid ? 'Authenticated' : 'Not authenticated');
        setIsAuthenticated(isAuthValid);
        
        if (!isAuthValid && authError) {
          toast({
            title: "Authentication Error",
            description: authError,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        toast({
          title: "Authentication Error",
          description: "Failed to verify your login status. Please try signing in again.",
          variant: "destructive",
        });
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [authError, toast]);
  
  // Show loading state while checking authentication
  if (loading || isChecking) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!isLoggedIn && !isAuthenticated) {
    console.log('Not authenticated, redirecting to signin');
    // Store the current path to redirect back after login
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }
  
  console.log('Authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
