
import { useNavigate } from 'react-router-dom';
import { kadoRedirectService } from './kadoRedirectService';
import { kadoWebhookService } from './kadoWebhookService';
import { kadoKycService } from './kadoKycService';
import { kadoApiService } from './kadoApiService';
import { KadoRedirectParams } from './types';
import { supabase } from '@/integrations/supabase/client';
import { isPlatform } from '@/utils/platformUtils';

/**
 * Hook to use Kado services with navigation
 */
export const useKado = () => {
  const navigate = useNavigate();
  
  /**
   * Redirect to Kado for payment and return to transaction status page
   * @param params Redirect parameters without returnUrl
   */
  const redirectToKadoAndReturn = async (params: Omit<KadoRedirectParams, 'returnUrl'>) => {
    // Get current authenticated user ID to use as userRef
    const { data: { session } } = await supabase.auth.getSession();
    const userRef = session?.user?.id;
    
    // Determine if we should use deep linking
    const useDeepLink = isPlatform('mobile');
    
    // Construct the return URL to the transaction status page
    const returnUrl = `${window.location.origin}/transaction/${params.transactionId}`;
    
    // Redirect to Kado
    await kadoRedirectService.redirectToKado({
      ...params,
      returnUrl,
      userRef,
      deepLinkBack: useDeepLink
    });
    
    // Navigate to the transaction status page
    navigate(`/transaction/${params.transactionId}`);
  };
  
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
    ...kadoRedirectService,
    ...kadoWebhookService,
    ...kadoKycService,
    ...kadoApiService,
    redirectToKadoAndReturn,
    checkCurrentUserKycStatus,
    requestCurrentUserKycVerification
  };
};
