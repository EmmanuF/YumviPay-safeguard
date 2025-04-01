import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Limit AppRole type to match the database enum
export type AppRole = 'admin' | 'user';

/**
 * Gets the current authenticated user or returns null
 */
export async function getCurrentAuthUser(): Promise<User | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting auth user:', authError);
      return null;
    }
    
    if (!authData.user) {
      console.log('No authenticated user found');
      return null;
    }
    
    return authData.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Calls the has_role database function to check if a user has a specific role
 */
export async function hasRole(role: AppRole, userId?: string): Promise<boolean> {
  try {
    console.log(`Checking if user has role: ${role}`);
    
    // Get the current user if userId is not provided
    if (!userId) {
      const authUser = await getCurrentAuthUser();
      if (!authUser) return false;
      userId = authUser.id;
      console.log(`Got user ID from auth: ${userId}`);
    }

    // First do a direct check for debugging
    const { data: directCheck, error: directError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role);
    
    console.log(`Direct DB check for ${role} role:`, directCheck, directError);

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
 */
export async function getUserRoles(userId?: string): Promise<AppRole[]> {
  try {
    console.log('Getting user roles');
    
    // Get the current user if userId is not provided
    if (!userId) {
      const authUser = await getCurrentAuthUser();
      if (!authUser) return [];
      userId = authUser.id;
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

    if (!data || data.length === 0) {
      console.log('No roles found for user');
      return [];
    }
    
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
 */
export async function addRole(role: AppRole, userId?: string): Promise<boolean> {
  try {
    console.log(`Adding role: ${role}`);
    
    // Get the current user if userId is not provided
    if (!userId) {
      const authUser = await getCurrentAuthUser();
      if (!authUser) return false;
      userId = authUser.id;
      console.log(`Got user ID from auth: ${userId}`);
    }

    // Insert the role if it doesn't already exist
    console.log(`Adding role ${role} for user ${userId}`);
    const { data, error } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId,
        role: role 
      })
      .select();

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error adding role:', error);
      return false;
    }

    console.log(`Role ${role} added successfully:`, data);
    return true;
  } catch (error) {
    console.error('Error in addRole:', error);
    return false;
  }
}

/**
 * Removes a role from a user
 */
export async function removeRole(role: AppRole, userId?: string): Promise<boolean> {
  try {
    // Get the current user if userId is not provided
    if (!userId) {
      const authUser = await getCurrentAuthUser();
      if (!authUser) return false;
      userId = authUser.id;
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
 */
export async function grantAdminRole(userId?: string): Promise<boolean> {
  try {
    console.log('Attempting to grant admin role');
    
    // Get the current user if userId is not provided
    if (!userId) {
      const authUser = await getCurrentAuthUser();
      if (!authUser) {
        console.error('No authenticated user found');
        return false;
      }
      userId = authUser.id;
    }
    
    console.log(`Granting admin role to user: ${userId}`);
    
    // Check if the role already exists
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // Not found error
      console.error('Error checking existing role:', checkError);
    }
    
    if (existingRole) {
      console.log('Admin role already exists for this user');
      return true;
    }
    
    // Insert admin role for user
    const { data, error } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId,
        role: 'admin' 
      })
      .select();

    if (error) {
      console.error('Error granting admin role:', error);
      return false;
    }

    console.log('Admin role granted successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in grantAdminRole:', error);
    return false;
  }
}

/**
 * Check if a specific email has admin role (for troubleshooting)
 */
export async function checkEmailForAdminRole(email: string): Promise<boolean> {
  try {
    console.log(`Checking if email ${email} has admin role`);
    
    // First approach: Look up the user by email in profiles table directly 
    // with explicit type declaration to avoid TS2589 errors
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1);
    
    if (profileData && profileData.length > 0) {
      const userId = profileData[0].id;
      console.log(`Found user with email in profiles: ${email}, id: ${userId}`);
      return await hasRole('admin', userId);
    }
    
    // Second approach: Check currently logged-in user
    const currentUser = await getCurrentAuthUser();
    if (currentUser && currentUser.email === email) {
      console.log(`Current user matches email: ${email}`);
      return await hasRole('admin', currentUser.id);
    }
    
    // If we can't find the user using either method
    console.log(`Could not find user with email: ${email} using available methods`);
    return false;
  } catch (error) {
    console.error('Error in checkEmailForAdminRole:', error);
    return false;
  }
}
