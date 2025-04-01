
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'user';

/**
 * Check if the current user has a specific role
 * 
 * @param role The role to check for
 * @returns Promise resolving to boolean indicating whether user has the role
 */
export const hasRole = async (role: AppRole): Promise<boolean> => {
  try {
    // First, get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      return false;
    }
    
    const userId = session.user.id;
    
    // Check if the user has the requested role using the has_role function
    const { data, error } = await supabase
      .rpc('has_role', { 
        user_id: userId, 
        role: role 
      });
    
    if (error) {
      console.error('Error checking role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Assign a role to a user
 * 
 * @param userId The UUID of the user
 * @param role The role to assign
 * @returns Promise with success status
 */
export const assignRole = async (userId: string, role: AppRole): Promise<boolean> => {
  try {
    // Check if current user is admin before allowing role assignment
    const isAdmin = await hasRole('admin');
    if (!isAdmin) {
      throw new Error('Only admins can assign roles');
    }
    
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });
    
    if (error) {
      console.error('Error assigning role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error assigning role to user:', error);
    return false;
  }
};

/**
 * Remove a role from a user
 * 
 * @param userId The UUID of the user
 * @param role The role to remove
 * @returns Promise with success status
 */
export const removeRole = async (userId: string, role: AppRole): Promise<boolean> => {
  try {
    // Check if current user is admin before allowing role removal
    const isAdmin = await hasRole('admin');
    if (!isAdmin) {
      throw new Error('Only admins can remove roles');
    }
    
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .match({ user_id: userId, role: role });
    
    if (error) {
      console.error('Error removing role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing role from user:', error);
    return false;
  }
};

/**
 * Get all roles for a user
 * 
 * @param userId The UUID of the user (optional, defaults to current user)
 * @returns Promise resolving to array of roles
 */
export const getUserRoles = async (userId?: string): Promise<AppRole[]> => {
  try {
    let targetUserId = userId;
    
    // If no userId is provided, get the current user's ID
    if (!targetUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        return [];
      }
      targetUserId = session.user.id;
    }
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', targetUserId);
    
    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
    
    return data?.map(item => item.role as AppRole) || [];
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
};
