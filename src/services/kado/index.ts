
// Re-export all Kado functionality
export * from './types';
export { kadoRedirectService } from './redirect';
export * from './kadoWebhookService';
export * from './kadoKycService';
export * from './kadoApiService';
export * from './useKado';
export * from './hooks';

// Create a combined service for backward compatibility
import { kadoRedirectService } from './redirect';
import { kadoWebhookService } from './kadoWebhookService';
import { kadoKycService } from './kadoKycService';
import { kadoApiService } from './kadoApiService';
import { useKado } from './useKado';

export const kadoService = {
  ...kadoRedirectService,
  ...kadoWebhookService,
  ...kadoKycService,
  ...kadoApiService
};
