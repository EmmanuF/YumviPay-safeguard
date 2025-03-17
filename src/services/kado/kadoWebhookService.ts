
import { KadoWebhookResponse } from './types';
import { Transaction } from '@/types/transaction';
import { getTransactionById } from '../transaction';

/**
 * Service to handle webhooks from Kado
 */
export const kadoWebhookService = {
  /**
   * Handle webhook received from Kado
   * @param response Webhook response data
   * @returns Updated transaction
   */
  handleWebhook: async (response: KadoWebhookResponse): Promise<Transaction | null> => {
    console.log('Received webhook from Kado:', response);
    
    // Get the transaction
    const transaction = await getTransactionById(response.transactionId);
    
    if (!transaction) {
      console.error('Transaction not found:', response.transactionId);
      return null;
    }
    
    // If a userRef was included in the webhook, we should store it with the transaction
    if (response.userRef) {
      // In a real implementation, this would update the transaction in the database
      console.log(`Webhook includes userRef: ${response.userRef}`);
      
      // This would track the KYC status for this user
      // Example: await updateUserKycStatus(response.userRef, response.status);
    }
    
    // In a real app, this would update the transaction status in your database
    // For now, we'll just return the transaction
    return transaction;
  }
};
