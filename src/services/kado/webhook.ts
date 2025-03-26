
/**
 * Handles Kado payment webhooks and transaction status updates
 */

import { updateOfflineTransaction } from '@/services/transaction/store';

// Transaction status types that can be received from Kado
export type KadoTransactionStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded' 
  | 'cancelled';

interface KadoWebhookPayload {
  transaction_id: string;
  status: KadoTransactionStatus;
  amount: string;
  fee?: string;
  provider?: string;
  payment_method?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Process Kado webhook data and update transaction status
 */
export const processKadoWebhook = async (webhookData: KadoWebhookPayload): Promise<void> => {
  try {
    console.log('📥 Processing Kado webhook:', webhookData);
    
    const { transaction_id, status, amount, fee, provider, payment_method, timestamp } = webhookData;
    
    // Update transaction in local storage
    updateOfflineTransaction(transaction_id, {
      status,
      totalAmount: amount,
      fee: fee || '0',
      provider: provider || '',
      paymentMethod: payment_method || '',
      updatedAt: new Date(timestamp),
      completedAt: status === 'completed' ? new Date(timestamp) : undefined
    });
    
    console.log(`✅ Transaction ${transaction_id} updated with status: ${status}`);
    
    // Dispatch custom event for real-time updates in the UI
    window.dispatchEvent(new CustomEvent('kado-webhook-received', { 
      detail: { transactionId: transaction_id, status }
    }));
  } catch (error) {
    console.error('❌ Error processing Kado webhook:', error);
    throw error;
  }
};

/**
 * Simulates a webhook event for testing purposes
 */
export const simulateWebhook = async (transactionId: string): Promise<void> => {
  console.log(`🧪 Simulating webhook for transaction ${transactionId}`);
  
  // Get transaction data from local storage
  const rawStoredData = localStorage.getItem(`kado_transaction_${transactionId}`);
  const storedData = rawStoredData ? JSON.parse(rawStoredData) : null;
  
  // Create webhook payload
  const simulatedPayload: KadoWebhookPayload = {
    transaction_id: transactionId,
    status: 'completed', // Simulate successful completion
    amount: storedData?.amount || '100',
    fee: '1.50',
    provider: storedData?.paymentMethod === 'mobile_money' ? 'MTN Mobile Money' : 'Afriland First Bank',
    payment_method: storedData?.paymentMethod || 'mobile_money',
    timestamp: new Date().toISOString(),
    metadata: {
      simulation: true,
      originalData: storedData
    }
  };
  
  // Process the simulated webhook after a delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  await processKadoWebhook(simulatedPayload);
  
  console.log('✅ Webhook simulation completed');
};
