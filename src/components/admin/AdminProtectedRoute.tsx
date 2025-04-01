
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
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const { isAdmin, isLoading: adminLoading, error, userId } = useAdmin();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);
  const [hasShownToast, setHasShownToast] = useState<boolean>(false);

  // Log current auth state for debugging
  useEffect(() => {
    console.log('AdminProtectedRoute - Auth State:', { 
      isLoggedIn, 
      authLoading,
      user: user ? { id: user.id, email: user.email } : 'No user',
      isMobileDevice
    });
  }, [isLoggedIn, authLoading, user, isMobileDevice]);

  // Log admin state for debugging
  useEffect(() => {
    console.log('AdminProtectedRoute - Admin State:', { 
      isAdmin, 
      adminLoading, 
      error,
      userId
    });
  }, [isAdmin, adminLoading, error, userId]);

  // Check if on a native mobile platform - Run once on component mount
  useEffect(() => {
    // Detect platform synchronously to avoid state updates during render
    const isMobile = isPlatform('native');
    console.log('Platform detection - isMobile:', isMobile);
    setIsMobileDevice(isMobile);
  }, []); // Empty dependency array ensures this runs only once
  
  // Handle mobile restriction toast - separate from platform check
  useEffect(() => {
    // Only show toast if we know it's a mobile device and haven't shown it yet
    if (isMobileDevice === true && !hasShownToast) {
      toast({
        title: "Access Restricted",
        description: "Admin features are not accessible on mobile devices",
        variant: "destructive",
      });
      setHasShownToast(true);
    }
  }, [isMobileDevice, toast, hasShownToast]);
  
  // Handle auth error toast - separate effect
  useEffect(() => {
    if (error && !hasShownToast) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
      setHasShownToast(true);
    }
  }, [error, toast, hasShownToast]);

  // Handle access denied toast - separate effect
  useEffect(() => {
    // Only show toast if we know user is not admin, is logged in, and haven't shown toast yet
    if (isLoggedIn && !isAdmin && !adminLoading && !authLoading && !hasShownToast) {
      console.log('Access denied to admin panel. User:', user?.email);
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
      setHasShownToast(true);
    }
  }, [isAdmin, isLoggedIn, adminLoading, authLoading, toast, hasShownToast, user]);

  // Show loading state until checks are complete
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
    console.log('User is not an admin, redirecting to home. User email:', user?.email);
    return <Navigate to="/" replace />;
  }

  console.log('Admin access granted, rendering admin content');
  // Admin access granted
  return <>{children}</>;
};

export default AdminProtectedRoute;
