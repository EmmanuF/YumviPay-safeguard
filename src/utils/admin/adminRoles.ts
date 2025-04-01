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
    console.log(`Checking if user has role: ${role}`);
    
    // Get the current user if userId is not provided
    if (!userId) {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error getting auth user:', authError);
        return false;
      }
      
      if (!authData.user) {
        console.log('No authenticated user found');
        return false;
      }
      
      userId = authData.user.id;
      console.log(`Got user ID from auth: ${userId}`);
    }

    // Call the has_role function via RPC
    console.log(`Calling has_role function with params: user_id=${userId}, role=${role}`);
    const { data, error } = await supabase.rpc('has_role', {
      user_id: userId,
      role: role
    });

    if (error) {
      console.error('Error checking role:', error);
      return false;
    }

    console.log(`Role check result for ${role}:`, data);
    
    // Check if data is null or undefined and return false in that case
    if (data === null || data === undefined) {
      console.log('No role data returned, defaulting to false');
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error('Error in hasRole:', error);
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
    console.log('Getting user roles');
    
    // Get the current user if userId is not provided
    if (!userId) {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error getting auth user:', authError);
        return [];
      }
      
      if (!authData.user) {
        console.log('No authenticated user found');
        return [];
      }
      
      userId = authData.user.id;
      console.log(`Got user ID from auth: ${userId}`);
    }

    // Get all roles
    console.log(`Querying user_roles for user: ${userId}`);
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
    console.log('User roles result:', data);
    return data.map(item => item.role as AppRole);
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return [];
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
    console.log(`Adding role: ${role}`);
    
    // Get the current user if userId is not provided
    if (!userId) {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error getting auth user:', authError);
        return false;
      }
      
      if (!authData.user) {
        console.log('No authenticated user found');
        return false;
      }
      
      userId = authData.user.id;
      console.log(`Got user ID from auth: ${userId}`);
    }

    // Insert the role if it doesn't already exist
    console.log(`Adding role ${role} for user ${userId}`);
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
 * Directly adds the admin role to a user - for debugging and setup
 * 
 * @param userId User ID to grant admin role to
 * @returns Promise<boolean> Success status
 */
export async function grantAdminRole(userId?: string): Promise<boolean> {
  try {
    console.log('Attempting to grant admin role');
    
    // Get the current user if userId is not provided
    if (!userId) {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error getting auth user:', authError);
        return false;
      }
      
      if (!authData.user) {
        console.log('No authenticated user found');
        return false;
      }
      
      userId = authData.user.id;
    }
    
    console.log(`Granting admin role to user: ${userId}`);
    
    // Insert admin role for user
    const { error } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId,
        role: 'admin' 
      })
      .select()
      .single();

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error granting admin role:', error);
      return false;
    }

    console.log('Admin role granted successfully');
    return true;
  } catch (error) {
    console.error('Error in grantAdminRole:', error);
    return false;
  }
}
