
import { generateTransactionId } from '@/utils/transactionUtils';
import { createFallbackTransaction } from '@/services/transaction/utils/fallbackTransactions';

export interface CompleteTransactionData {
  id: string;
  transactionId: string;
  amount: string;
  recipientName: string;
  recipientContact: string;
  country: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  totalAmount: string;
  paymentMethod: string;
  provider: string;
  sourceCurrency: string;
  targetCurrency: string;
  convertedAmount: string | number;
  exchangeRate: number;
}

export const prepareCompleteTransactionData = (transactionData: any, transactionId: string): CompleteTransactionData => {
  return {
    id: transactionId,
    transactionId: transactionId,
    amount: transactionData.amount?.toString() || '50',
    recipientName: transactionData.recipientName || 'Transaction Recipient',
    recipientContact: transactionData.recipientContact || transactionData.recipient || '+237650000000',
    country: transactionData.targetCountry || 'CM',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: 'Processing',
    totalAmount: transactionData.amount?.toString() || '50',
    paymentMethod: transactionData.paymentMethod || 'mobile_money',
    provider: transactionData.selectedProvider || 'MTN Mobile Money',
    sourceCurrency: transactionData.sourceCurrency || 'USD',
    targetCurrency: transactionData.targetCurrency || 'XAF',
    convertedAmount: transactionData.convertedAmount || transactionData.receiveAmount || '0',
    exchangeRate: transactionData.exchangeRate || 0,
  };
};

export const storeTransactionData = (transactionId: string, data: any): boolean => {
  try {
    const completeData = prepareCompleteTransactionData(data, transactionId);
    const storageData = JSON.stringify(completeData);
    
    console.log(`📦 Storing COMPLETE transaction ${transactionId} with redundancy:`, completeData);
    
    const storageKeys = [
      `transaction_${transactionId}`,
      `transaction_backup_${transactionId}`,
      `pendingKadoTransaction`,
      `pending_transaction_${Date.now()}`,
      `latest_transaction`
    ];
    
    storageKeys.forEach(key => {
      try {
        localStorage.setItem(key, storageData);
      } catch (e) {
        console.error(`❌ Failed to store in localStorage with key ${key}:`, e);
      }
    });
    
    try {
      sessionStorage.setItem(`transaction_session_${transactionId}`, storageData);
      sessionStorage.setItem('lastTransactionId', transactionId);
    } catch (e) {
      console.error('❌ Error storing in sessionStorage:', e);
    }
    
    // Safely access window properties with proper TypeScript handling
    try {
      // @ts-ignore - Emergency data access
      window.__EMERGENCY_TRANSACTION = storageData;
      // @ts-ignore - Emergency data access
      window.__TRANSACTION_ID = transactionId;
    } catch (e) {
      console.error('❌ Error storing in window object:', e);
    }
    
    try {
      const verification = localStorage.getItem(`transaction_${transactionId}`);
      console.log(`✅ Storage verification: ${!!verification}`);
      return !!verification;
    } catch (e) {
      console.error('❌ Error verifying storage:', e);
      return false;
    }
  } catch (error) {
    console.error('❌ Error in storeTransactionData:', error);
    return false;
  }
};

export const createAndStoreTransaction = (transactionData: any): { transactionId: string; success: boolean } => {
  const transactionId = generateTransactionId();
  console.log(`🆔 Generated transaction ID: ${transactionId}`);
  
  // Create a fallback transaction immediately
  const fallback = createFallbackTransaction(transactionId);
  console.log('Created fallback transaction before redirect:', fallback);
  
  const stored = storeTransactionData(transactionId, transactionData);
  
  return {
    transactionId,
    success: stored
  };
};
