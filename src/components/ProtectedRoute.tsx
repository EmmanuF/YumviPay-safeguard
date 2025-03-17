
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';

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
        
        // Add a timeout for the authentication check
        const authCheckPromise = supabase.auth.getSession();
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Authentication check timed out'));
          }, 10000); // 10 seconds timeout
        });
        
        // Race the auth check against the timeout
        const { data } = await Promise.race([
          authCheckPromise,
          timeoutPromise as Promise<any>
        ]);
        
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
      } catch (error: any) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to verify your login status. Please try signing in again.",
          variant: "destructive",
        });
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [authError, toast]);
  
  // Show loading state while checking authentication, but with a more informative UI
  if (loading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">Verifying authentication...</p>
      </div>
    );
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
