
import { Transaction, TransactionStatus } from "@/types/transaction";
import { updateTransactionStatus } from './updateStatus';

/**
 * Simulate a webhook response for a transaction (for testing)
 * @param transactionId Transaction ID
 * @param status Status to set (defaults to random success/failure)
 */
export const simulateWebhook = async (
  transactionId: string,
  status?: 'completed' | 'failed'
): Promise<void> => {
  try {
    // If no status is provided, randomly set to completed or failed
    const finalStatus = status || (Math.random() > 0.3 ? 'completed' : 'failed');
    
    console.log(`Simulating webhook for transaction ${transactionId} with status: ${finalStatus}`);
    
    // Wait a bit to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update the transaction status
    if (finalStatus === 'completed') {
      await updateTransactionStatus(transactionId, 'completed', {
        completedAt: new Date()
      });
    } else {
      const failureReasons = [
        'Insufficient funds',
        'Recipient account not found',
        'Transaction limit exceeded',
        'Network error',
        'Service temporarily unavailable'
      ];
      
      const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      
      await updateTransactionStatus(transactionId, 'failed', {
        failureReason: randomReason
      });
    }
    
    console.log(`Webhook simulation completed for transaction ${transactionId}`);
  } catch (error) {
    console.error('Error simulating webhook:', error);
  }
};
