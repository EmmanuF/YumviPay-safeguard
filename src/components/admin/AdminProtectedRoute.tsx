
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/auth';
import LoadingState from '@/components/transaction/LoadingState';
import { useToast } from '@/components/ui/use-toast';
import { isPlatform } from '@/utils/platform';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, error } = useAdmin();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);

  // Check if on a native mobile platform - Run once on component mount
  useEffect(() => {
    // Detect platform synchronously to avoid state updates during render
    const isMobile = isPlatform('native');
    setIsMobileDevice(isMobile);
    
    // Show toast only if on mobile - moved inside useEffect to prevent render loop
    if (isMobile) {
      toast({
        title: "Access Restricted",
        description: "Admin features are not accessible on mobile devices",
        variant: "destructive",
      });
    }
  }, []); // Empty dependency array ensures this runs only once
  
  // Separate effect for error handling to prevent render loops
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Show loading state until platform check is done
  if (isMobileDevice === null || authLoading || adminLoading) {
    return <LoadingState message="Verifying admin access..." submessage="Please wait while we check your credentials" />;
  }

  // Block access on native mobile devices
  if (isMobileDevice === true) {
    return <Navigate to="/" replace />;
  }

  // Not logged in, redirect to sign in
  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }

  // Not an admin
  if (!isAdmin) {
    // Only show toast once rather than during render
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin panel",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  // Admin access granted
  return <>{children}</>;
};

export default AdminProtectedRoute;
