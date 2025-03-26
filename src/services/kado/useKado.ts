
import { useKadoApiConnection } from './hooks/useKadoApiConnection';
import { useKadoRedirect } from './hooks/useKadoRedirect';
import { useKadoKyc } from './hooks/useKadoKyc';
import { useKadoPaymentMethods } from './hooks/useKadoPaymentMethods';
import { kadoRedirectService } from './redirect';
import { kadoWebhookService } from './kadoWebhookService';
import { kadoKycService } from './kadoKycService';
import { kadoApiService } from './kadoApiService';

/**
 * Main hook to use Kado services with navigation
 * Composes smaller, focused hooks for better maintainability
 */
export const useKado = () => {
  const apiConnection = useKadoApiConnection();
  const kadoRedirect = useKadoRedirect(apiConnection.checkApiConnection);
  const kadoKyc = useKadoKyc();
  const kadoPaymentMethods = useKadoPaymentMethods();
  
  return {
    // API connection
    isApiConnected: apiConnection.isApiConnected,
    isLoading: kadoRedirect.isLoading,
    checkApiConnection: apiConnection.checkApiConnection,
    
    // Re-export all service methods for backward compatibility
    ...kadoRedirectService,
    ...kadoWebhookService,
    ...kadoKycService,
    ...kadoApiService,
    
    // New hook methods
    redirectToKadoAndReturn: kadoRedirect.redirectToKadoAndReturn,
    checkCurrentUserKycStatus: kadoKyc.checkCurrentUserKycStatus,
    requestCurrentUserKycVerification: kadoKyc.requestCurrentUserKycVerification,
    getCountryPaymentMethods: kadoPaymentMethods.getCountryPaymentMethods
  };
};
