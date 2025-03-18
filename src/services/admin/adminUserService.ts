
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
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    // Get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    
    // Combine the data
    const combinedUsers = profiles.map(profile => {
      // Find matching auth user
      const authUser = authUsers?.users?.find(user => user.id === profile.id);
      
      return {
        id: profile.id,
        name: profile.full_name || 'Unknown',
        email: authUser?.email || 'No email',
        country: profile.country_code || 'Unknown',
        // Mock status based on last activity
        status: authUser?.last_sign_in_at ? 'active' : 'inactive',
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
        status: 'active',
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
