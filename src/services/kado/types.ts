
import { Transaction } from '@/types/transaction';

/**
 * Interface for Kado redirect params
 */
export interface KadoRedirectParams {
  amount: string;
  recipientName: string;
  recipientContact: string;
  country: string;
  paymentMethod: string;
  transactionId: string;
  returnUrl: string;
  userRef?: string;
  deepLinkBack?: boolean;
}

/**
 * Interface for Kado webhook response
 */
export interface KadoWebhookResponse {
  status: 'success' | 'failure';
  transactionId: string;
  kadoTransactionId: string;
  timestamp: string;
  message?: string;
  failureReason?: string;
  userRef?: string;
}

/**
 * Interface for KYC status response from Kado API
 */
export interface KadoKycStatusResponse {
  status: 'verified' | 'pending' | 'rejected' | 'not_started';
  timestamp: string;
  details?: {
    rejectionReason?: string;
    completedSteps?: string[];
    remainingSteps?: string[];
  };
}
