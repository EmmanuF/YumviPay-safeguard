
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Check if the user is an admin
  // This is a placeholder - in a real application, you would check against roles in your database
  const isAdmin = isLoggedIn && user?.email?.endsWith('@yumvi-pay.com');
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Here you would implement proper role checking
        // For example, query a roles table in your database
        // For now, we'll just use the email check above
        
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsChecking(false);
      }
    };
    
    if (!authLoading && isLoggedIn) {
      checkAdminStatus();
    } else if (!authLoading) {
      setIsChecking(false);
    }
  }, [authLoading, isLoggedIn, user]);
  
  // Show loading state while checking authentication
  if (authLoading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg font-medium">Verifying admin access...</p>
      </div>
    );
  }
  
  // Redirect non-admins to home page
  if (!isAdmin) {
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }
  
  // Admin user can access the route
  return <>{children}</>;
};

export default AdminProtectedRoute;
