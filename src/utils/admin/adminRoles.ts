
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Limit AppRole type to match the database enum
export type AppRole = 'admin' | 'user';

/**
 * Calls the has_role database function to check if a user has a specific role
 * 
 * @param role The role to check for
 * @param userId Optional user ID (defaults to current user)
 * @returns Boolean indicating if the user has the specified role
 */
export async function hasRole(role: AppRole, userId?: string): Promise<boolean> {
  try {
    // Get the current user if userId is not provided
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return false;
      }
      userId = authData.user.id;
    }

    // Call the has_role function via RPC
    const { data, error } = await supabase.rpc('has_role', {
      user_id: userId,
      role: role
    });

    if (error) {
      console.error('Error checking role:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Error in hasRole:', error);
    return false;
  }
}

/**
 * Adds a role to a user
 * 
 * @param role The role to add
 * @param userId Optional user ID (defaults to current user)
 * @returns Boolean indicating success
 */
export async function addRole(role: AppRole, userId?: string): Promise<boolean> {
  try {
    // Get the current user if userId is not provided
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return false;
      }
      userId = authData.user.id;
    }

    // Insert the role if it doesn't already exist
    const { error } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId,
        role: role 
      })
      .select()
      .single();

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error adding role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addRole:', error);
    return false;
  }
}

/**
 * Removes a role from a user
 * 
 * @param role The role to remove
 * @param userId Optional user ID (defaults to current user)
 * @returns Boolean indicating success
 */
export async function removeRole(role: AppRole, userId?: string): Promise<boolean> {
  try {
    // Get the current user if userId is not provided
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return false;
      }
      userId = authData.user.id;
    }

    // Delete the role
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      console.error('Error removing role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeRole:', error);
    return false;
  }
}

/**
 * Gets all roles for a user
 * 
 * @param userId Optional user ID (defaults to current user)
 * @returns Array of roles
 */
export async function getUserRoles(userId?: string): Promise<AppRole[]> {
  try {
    // Get the current user if userId is not provided
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return [];
      }
      userId = authData.user.id;
    }

    // Get all roles
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting roles:', error);
      return [];
    }

    if (!data) return [];
    
    // Extract and return the roles
    return data.map(item => item.role as AppRole);
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return [];
  }
}
