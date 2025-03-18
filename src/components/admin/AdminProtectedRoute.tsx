
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();
  
  // Check if the user is an admin - improved logging
  const isAdmin = isLoggedIn && user?.email?.endsWith('@yumvipay.com');
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log('Checking admin status:', {
          isLoggedIn,
          userEmail: user?.email,
          isAdmin,
          location: location.pathname
        });
        
        // For security, we should eventually implement proper role-based checks here
        // For now, we're just using the email domain check
        
        if (!isLoggedIn) {
          console.log('User is not logged in, redirecting to signin');
          toast({
            title: "Authentication Required",
            description: "Please sign in to access the admin area",
            variant: "destructive",
          });
        } else if (!isAdmin) {
          console.log('User is logged in but not an admin:', user?.email);
          toast({
            title: "Access Denied",
            description: "You do not have admin privileges",
            variant: "destructive",
          });
        } else {
          console.log('Admin access granted for:', user?.email);
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Failed to verify admin privileges",
          variant: "destructive",
        });
        setIsChecking(false);
      }
    };
    
    checkAdminStatus();
  }, [authLoading, isLoggedIn, user, isAdmin, location.pathname, toast]);
  
  // Show loading state while checking authentication
  if (authLoading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg font-medium">Verifying admin access...</p>
      </div>
    );
  }
  
  // Redirect non-admins to signin page
  if (!isAdmin) {
    console.log('Not an admin, redirecting from:', location.pathname);
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }
  
  // Admin user can access the route
  return <>{children}</>;
};

export default AdminProtectedRoute;
