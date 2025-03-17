
// Re-export all Kado functionality
export * from './types';
export * from './kadoRedirectService';
export * from './kadoWebhookService';
export * from './kadoKycService';
export * from './kadoApiService';
export * from './useKado';

// Create a combined service for backward compatibility
import { kadoRedirectService } from './kadoRedirectService';
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
