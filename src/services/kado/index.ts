
import { handleKadoRedirect } from './redirect/redirectHandler';

/**
 * Service to handle all interactions with Kado
 */
export const kadoService = {
  // Redirect functions
  redirectToKado: async (params: import('./types').KadoRedirectParams): Promise<void> => {
    return handleKadoRedirect(params);
  }
};

// Re-export types but avoid duplicate exports
export * from './types';

// Export redirect service for backward compatibility
export { kadoRedirectService } from './redirect';
