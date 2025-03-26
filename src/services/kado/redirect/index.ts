
import { KadoRedirectParams } from './types';
import { handleKadoRedirect } from './redirectHandler';

/**
 * Service to handle redirecting to Kado for KYC and payment processing
 */
export const kadoRedirectService = {
  /**
   * Redirect to Kado for KYC and payment processing
   * @param params Redirect parameters
   * @returns Promise that resolves when redirected
   */
  redirectToKado: async (params: KadoRedirectParams): Promise<void> => {
    return handleKadoRedirect(params);
  }
};

export * from './types';
