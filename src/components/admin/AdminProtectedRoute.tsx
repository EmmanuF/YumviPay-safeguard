
import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/auth';
import LoadingState from '@/components/transaction/LoadingState';
import { useToast } from '@/components/ui/use-toast';
import { isPlatform } from '@/utils/platform';
import { grantAdminRole } from '@/utils/admin/adminRoles';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const { 
    isAdmin, 
    isLoading: adminLoading, 
    error, 
    userId, 
    refreshAdminStatus, 
    debugInfo 
  } = useAdmin();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);
  const [hasAttemptedRoleCheck, setHasAttemptedRoleCheck] = useState<boolean>(false);
  const [debugViewVisible, setDebugViewVisible] = useState<boolean>(false);

  // Check if on a native mobile platform - Run once on component mount
  useEffect(() => {
    const isMobile = isPlatform('native');
    console.log('Platform detection - isMobile:', isMobile);
    setIsMobileDevice(isMobile);
  }, []);

  // Set up debug info logger
  useEffect(() => {
    console.log('AdminProtectedRoute - Auth State:', { 
      isLoggedIn, 
      authLoading,
      user: user ? { id: user.id, email: user.email } : 'No user',
      isMobileDevice
    });
  }, [isLoggedIn, authLoading, user, isMobileDevice]);

  useEffect(() => {
    console.log('AdminProtectedRoute - Admin State:', { 
      isAdmin, 
      adminLoading, 
      error,
      userId,
      debugInfo
    });
    
    if (!adminLoading && user && !isAdmin && !hasAttemptedRoleCheck) {
      console.log('User is logged in but not admin. Debug info:', debugInfo);
      setHasAttemptedRoleCheck(true);
    }
  }, [isAdmin, adminLoading, error, userId, user, hasAttemptedRoleCheck, debugInfo]);
  
  // Handle mobile restriction toast
  useEffect(() => {
    if (isMobileDevice === true) {
      toast({
        title: "Access Restricted",
        description: "Admin features are not accessible on mobile devices",
        variant: "destructive",
      });
    }
  }, [isMobileDevice, toast]);
  
  // Handle auth error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handle access denied toast
  useEffect(() => {
    if (isLoggedIn && !isAdmin && !adminLoading && !authLoading && hasAttemptedRoleCheck) {
      console.log('Access denied to admin panel. User:', user?.email);
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel. If you believe this is an error, please contact support.",
        variant: "destructive",
      });
    }
  }, [isAdmin, isLoggedIn, adminLoading, authLoading, toast, hasAttemptedRoleCheck, user]);

  const toggleDebugView = useCallback(() => {
    setDebugViewVisible(prev => !prev);
  }, []);
  
  const handleGrantAdminRole = useCallback(async () => {
    if (user) {
      console.log('Attempting to grant admin role to user:', user.id);
      try {
        const result = await grantAdminRole(user.id);
        console.log('Grant admin result:', result);
        
        if (result) {
          toast({
            title: "Admin Role Granted",
            description: "Admin role has been successfully granted. Refreshing status...",
          });
          await refreshAdminStatus();
        } else {
          toast({
            title: "Error Granting Role",
            description: "Failed to grant admin role. Check console for details.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error granting admin role:', err);
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Unknown error occurred",
          variant: "destructive",
        });
      }
    }
  }, [user, refreshAdminStatus, toast]);

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

  // Show debug view for troubleshooting
  if (debugViewVisible) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Access Debug View</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre>{JSON.stringify({ 
                id: user?.id, 
                email: user?.email, 
                isLoggedIn, 
                authLoading 
              }, null, 2)}</pre>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Admin Status</h2>
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre>{JSON.stringify({ 
                isAdmin, 
                roles: debugInfo, 
                adminLoading, 
                error,
              }, null, 2)}</pre>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={refreshAdminStatus} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Admin Status
            </button>
            
            <button 
              onClick={handleGrantAdminRole} 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Grant Admin Role
            </button>
            
            <button 
              onClick={toggleDebugView} 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Admin
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>If you are seeing access denied messages but believe you should have admin access:</p>
            <ol className="list-decimal ml-5 mt-2">
              <li>Check if your user ID ({user?.id}) has the admin role in the database</li>
              <li>Try using the "Grant Admin Role" button above</li>
              <li>Check browser console for additional debugging information</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Not an admin
  if (!isAdmin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="mb-4">
            You don't have permission to access the admin panel.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            User: {user?.email}
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Home
            </button>
            <button
              onClick={toggleDebugView}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Debug Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Admin access granted, rendering admin content');
  // Admin access granted
  return <>{children}</>;
};

export default AdminProtectedRoute;
