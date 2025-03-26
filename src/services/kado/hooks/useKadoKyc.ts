
import { supabase } from '@/integrations/supabase/client';
import { kadoKycService } from '../kadoKycService';

/**
 * Hook for managing Kado KYC functionality
 */
export const useKadoKyc = () => {
  /**
   * Check KYC status for current user
   */
  const checkCurrentUserKycStatus = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.log('No authenticated user to check KYC status');
        return null;
      }
      
      // Check KYC status for current user
      return await kadoKycService.checkKycStatus(session.user.id);
    } catch (error) {
      console.error('Error checking current user KYC status:', error);
      return null;
    }
  };
  
  /**
   * Request KYC verification for current user
   */
  const requestCurrentUserKycVerification = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.log('No authenticated user to request KYC verification');
        return {
          success: false,
          message: 'No authenticated user found'
        };
      }
      
      // Request KYC verification
      return await kadoKycService.requestKycVerification(session.user.id);
    } catch (error) {
      console.error('Error requesting KYC verification:', error);
      return {
        success: false,
        message: 'Error requesting KYC verification'
      };
    }
  };
  
  return {
    checkCurrentUserKycStatus,
    requestCurrentUserKycVerification
  };
};
