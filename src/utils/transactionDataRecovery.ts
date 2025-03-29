
/**
 * Utility functions to recover transaction data when something goes wrong
 */
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';

export const recoverTransactionData = (
  currentStep: SendMoneyStep, 
  updateTransactionData: (data: any) => void,
  cachedDataRef: React.MutableRefObject<any>
) => {
  console.log('[Recovery] Attempting to recover transaction data for step:', currentStep);
  
  // Try to recover from the ref
  if (cachedDataRef?.current) {
    console.log('[Recovery] Data found in ref cache:', cachedDataRef.current);
    updateTransactionData(cachedDataRef.current);
    return { recovered: true, source: 'ref' };
  }
  
  // Try to recover from localStorage
  try {
    const keys = Object.keys(localStorage);
    const transactionKeys = keys.filter(key => 
      key.startsWith('transaction_') || 
      key.includes('transaction') || 
      key.includes('pending')
    );
    
    if (transactionKeys.length > 0) {
      // Get the most recent transaction by parsing dates
      let mostRecent = null;
      let mostRecentDate = new Date(0); // epoch
      
      for (const key of transactionKeys) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          const date = data.createdAt ? new Date(data.createdAt) : new Date(0);
          
          if (date > mostRecentDate) {
            mostRecent = data;
            mostRecentDate = date;
          }
        } catch (e) {
          console.error('[Recovery] Error parsing item:', key, e);
        }
      }
      
      if (mostRecent) {
        console.log('[Recovery] Recovered from localStorage:', mostRecent);
        updateTransactionData(mostRecent);
        return { recovered: true, source: 'localStorage' };
      }
    }
  } catch (e) {
    console.error('[Recovery] Error accessing localStorage:', e);
  }
  
  // Create default data if recovery failed
  const defaultData = {
    id: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    amount: '50',
    recipientName: '',
    country: 'CM',
    status: 'pending'
  };
  
  console.log('[Recovery] Creating default data:', defaultData);
  updateTransactionData(defaultData);
  return { recovered: false, source: 'default' };
};
