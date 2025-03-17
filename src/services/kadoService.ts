
// This file is maintained for backward compatibility
// It re-exports everything from the new kado directory to ensure existing imports work

import { 
  kadoService,
  KadoRedirectParams,
  KadoWebhookResponse,
  KadoKycStatusResponse,
  useKado
} from './kado';

// Re-export types
export type { 
  KadoRedirectParams,
  KadoWebhookResponse,
  KadoKycStatusResponse
};

// Re-export services and hooks
export { kadoService, useKado };
