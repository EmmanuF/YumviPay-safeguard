
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
  
  // Function to check admin status
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
      
      // Check if user has admin role
      const adminStatus = await hasRole('admin');
      setIsAdmin(adminStatus);
      
      // Get all roles for the user
      const userRoles = await getUserRoles();
      setRoles(userRoles);
      
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError('Failed to verify admin status');
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
