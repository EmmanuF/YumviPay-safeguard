
import { Transaction } from '@/types/transaction';

/**
 * Interface for Kado redirect parameters
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
 * Interface for transaction storage operations
 */
export interface TransactionStorageResult {
  success: boolean;
  verified: boolean;
  attempts: number;
}
