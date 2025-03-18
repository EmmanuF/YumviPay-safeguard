
import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  country: string;
  status: 'active' | 'inactive' | 'suspended';
  registered: string;
}

/**
 * Fetch all users for admin
 */
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  console.log('Fetching admin users list...');
  
  try {
    // Get auth users (for email)
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    // Get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    
    // Make sure authUsers is an array
    const authUsers = authData?.users || [];
    
    // Combine the data
    const combinedUsers = profiles.map(profile => {
      // Find matching auth user
      const authUser = authUsers.find(user => user.id === profile.id);
      
      // Determine status based on last sign in (defaulting to inactive if not found)
      let status: 'active' | 'inactive' | 'suspended' = 'inactive';
      if (authUser?.last_sign_in_at) {
        status = 'active';
      }
      
      return {
        id: profile.id,
        name: profile.full_name || 'Unknown',
        email: authUser?.email || 'No email',
        country: profile.country_code || 'Unknown',
        status,
        registered: profile.created_at
      };
    });
    
    return combinedUsers;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    
    // If we can't access the admin API (most likely case),
    // fall back to just profiles data
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      return profiles.map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Unknown',
        email: 'Protected',
        country: profile.country_code || 'Unknown',
        status: 'active' as const,
        registered: profile.created_at
      }));
    } catch (fallbackError) {
      console.error('Fallback error fetching users:', fallbackError);
      return [];
    }
  }
};

/**
 * Update user status
 */
export const updateUserStatus = async (userId: string, status: string): Promise<boolean> => {
  console.log(`Updating user ${userId} status to ${status}...`);
  
  try {
    // In a real implementation, this would update the user's status
    // For now we'll just return success
    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    return false;
  }
};
