
// Import necessary packages and types
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/auth';
import { Database } from '@/integrations/supabase/types';

// Define available roles in the application based on the database schema
// Note: This matches the Supabase enum 'app_role' which only allows 'admin' or 'user'
export type AppRole = Database['public']['Enums']['app_role'];

// Role utility functions

/**
 * Check if a user has a specific role
 * @param role The role to check for
 * @param userId Optional user ID (defaults to current user)
 * @returns boolean indicating if user has the role
 */
export async function hasRole(role: AppRole, userId?: string): Promise<boolean> {
  try {
    // Get the current user's ID if not provided
    if (!userId) {
      const currentUser = supabase.auth.getUser();
      const user = (await currentUser).data.user;
      
      if (!user) {
        console.log('No user found when checking role');
        return false;
      }
      
      userId = user.id;
    }
    
    console.log('Calling has_role function with params:', { user_id: userId, role });
    
    // Call the has_role RPC function in Supabase
    const { data, error } = await supabase
      .rpc('has_role', {
        user_id: userId,
        role: role
      });
      
    console.log('Role check result for', role + ':', data);
    
    if (error) {
      console.error('Error checking role:', error.message);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception when checking role:', error);
    return false;
  }
}

/**
 * Get all roles for the current user
 * @param userId Optional user ID (defaults to current user)
 * @returns Array of roles the user has
 */
export async function getUserRoles(userId?: string): Promise<AppRole[]> {
  try {
    // Get the current user's ID if not provided
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      userId = user.id;
    }
    
    console.log('Got user ID from auth:', userId);
    console.log('Querying user_roles for user:', userId);
    
    // Query the user_roles table for this user
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user roles:', error.message);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('No roles found for user');
      return [];
    }
    
    // Extract and return the roles
    const roles = data.map(r => r.role);
    console.log('User roles:', roles);
    return roles;
  } catch (error) {
    console.error('Exception when getting user roles:', error);
    return [];
  }
}

/**
 * Assign a role to a user
 * @param userId The user to assign the role to
 * @param role The role to assign
 * @returns True if successful, false otherwise
 */
export async function assignRole(userId: string, role: AppRole): Promise<boolean> {
  try {
    // Check if the user already has this role
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role)
      .single();
      
    if (data) {
      // User already has this role
      return true;
    }
    
    // Assign the role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });
      
    if (insertError) {
      console.error('Error assigning role:', insertError.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when assigning role:', error);
    return false;
  }
}

/**
 * Remove a role from a user
 * @param userId The user to remove the role from
 * @param role The role to remove
 * @returns True if successful, false otherwise
 */
export async function removeRole(userId: string, role: AppRole): Promise<boolean> {
  try {
    // Remove the role
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
      
    if (error) {
      console.error('Error removing role:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when removing role:', error);
    return false;
  }
}

/**
 * Check if the current user is an admin
 * @returns True if the user is an admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Grant admin role to a user
 * @param userId The user to grant admin to
 * @returns True if successful, false otherwise
 */
export async function grantAdminRole(userId: string): Promise<boolean> {
  return assignRole(userId, 'admin');
}

/**
 * Check if a user with a given email has the admin role
 * @param email The email to check
 * @returns True if the user is an admin, false otherwise
 */
export async function checkEmailForAdminRole(email: string): Promise<boolean> {
  try {
    // First, find the user ID from the email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
      
    if (userError || !userData) {
      console.error('Error finding user by email:', userError?.message || 'User not found');
      return false;
    }
    
    const userId = userData.id;
    
    // Then check if this user has the admin role
    return hasRole('admin', userId);
  } catch (error) {
    console.error('Exception when checking admin by email:', error);
    return false;
  }
}
