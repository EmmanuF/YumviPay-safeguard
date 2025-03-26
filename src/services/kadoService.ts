
// This file is maintained for backward compatibility
// It re-exports everything from the new kado directory to ensure existing imports work

import { kadoService, KadoRedirectParams, KadoWebhookResponse, KadoKycStatusResponse } from './kado';
import { useKado } from './kado/hooks/useKado'; // Fixed path to useKado

// Re-export types
export type { 
  KadoRedirectParams,
  KadoWebhookResponse,
  KadoKycStatusResponse
};

// Re-export services and hooks
export { kadoService, useKado };
