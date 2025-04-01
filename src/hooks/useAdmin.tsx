
import { useState, useEffect, useCallback } from 'react';
import { hasRole, AppRole, getUserRoles } from '@/utils/admin/adminRoles';
import { useAuth } from '@/contexts/auth';

export interface AdminState {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  roles: AppRole[];
  refreshAdminStatus: () => Promise<void>;
}

/**
 * Hook to check and manage admin status
 */
export const useAdmin = (): AdminState => {
  const { isLoggedIn, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to check admin status - strictly memoized to prevent infinite loops
  const checkAdminStatus = useCallback(async () => {
    if (!isLoggedIn || !user) {
      setIsAdmin(false);
      setRoles([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Checking admin status for user:', user?.id);
      
      // Check if user has admin role
      const adminStatus = await hasRole('admin');
      console.log('Admin status result:', adminStatus);
      setIsAdmin(adminStatus);
      
      // Get all roles for the user
      const userRoles = await getUserRoles();
      console.log('User roles:', userRoles);
      setRoles(userRoles);
      
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError('Failed to verify admin status');
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, user]);
  
  // Refresh admin status
  const refreshAdminStatus = useCallback(async () => {
    await checkAdminStatus();
  }, [checkAdminStatus]);
  
  // Check admin status when authentication state changes
  useEffect(() => {
    console.log('Auth state changed, checking admin status. isLoggedIn:', isLoggedIn);
    checkAdminStatus();
  }, [isLoggedIn, user, checkAdminStatus]);
  
  return {
    isAdmin,
    isLoading,
    error,
    roles,
    refreshAdminStatus
  };
};

export default useAdmin;
