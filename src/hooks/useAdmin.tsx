
import { useState, useEffect, useCallback } from 'react';
import { hasRole, AppRole, getUserRoles, grantAdminRole } from '@/utils/admin/adminRoles';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

export interface AdminState {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  roles: AppRole[];
  refreshAdminStatus: () => Promise<void>;
  userId: string | null;
  debugInfo: {
    lastChecked: string;
    email?: string | null;
    roleCheckResult?: boolean;
  };
}

/**
 * Hook to check and manage admin status with improved debugging
 */
export const useAdmin = (): AdminState => {
  const { isLoggedIn, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<AdminState['debugInfo']>({
    lastChecked: 'Not checked yet'
  });
  
  // Function to check admin status - strictly memoized to prevent infinite loops
  const checkAdminStatus = useCallback(async () => {
    if (!isLoggedIn || !user) {
      console.log('User not logged in, setting admin status to false');
      setIsAdmin(false);
      setRoles([]);
      setUserId(null);
      setIsLoading(false);
      setDebugInfo({
        lastChecked: new Date().toISOString(),
        email: null,
        roleCheckResult: false
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setUserId(user.id);
      
      console.log('Checking admin status for user:', user.id, user.email);
      setDebugInfo(prev => ({
        ...prev,
        lastChecked: new Date().toISOString(),
        email: user.email
      }));
      
      // First check directly in the database to debug
      const { data: directRoleCheck, error: directRoleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');
      
      console.log('Direct DB Role check result:', directRoleCheck, directRoleError);
      
      // Check if user has admin role
      const adminStatus = await hasRole('admin');
      console.log('Admin status result:', adminStatus);
      
      setDebugInfo(prev => ({
        ...prev,
        roleCheckResult: adminStatus
      }));
      
      setIsAdmin(adminStatus);
      
      // Get all roles for the user
      const userRoles = await getUserRoles();
      console.log('User roles:', userRoles);
      setRoles(userRoles);
      
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError('Failed to verify admin status');
      setIsAdmin(false);
      setDebugInfo(prev => ({
        ...prev, 
        error: err instanceof Error ? err.message : String(err)
      }));
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, user]);
  
  // Refresh admin status
  const refreshAdminStatus = useCallback(async () => {
    console.log('Manually refreshing admin status');
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
    refreshAdminStatus,
    userId,
    debugInfo
  };
};

export default useAdmin;
