
import { Transaction } from '@/types/transaction';

/**
 * Stores transaction data in multiple storage mechanisms for redundancy
 * @param transaction Transaction object to store
 * @param transactionId Transaction ID for storage keys
 * @returns Promise resolving to storage status
 */
export const storeTransactionData = async (
  transaction: Partial<Transaction>, 
  transactionId: string
): Promise<{ success: boolean; verified: boolean; attempts: number }> => {
  console.log('📦 Storing transaction in all available storage mechanisms');
  
  // JSON serialized for localStorage/sessionStorage
  const transactionData = JSON.stringify({
    ...transaction,
    transactionId,
    createdAt: transaction.createdAt?.toISOString(),
    updatedAt: transaction.updatedAt?.toISOString()
  });
  
  // Store in multiple locations with different keys for redundancy
  const storageKeys = [
    `transaction_${transactionId}`,
    `transaction_backup_${transactionId}`,
    `emergency_transaction_${transactionId}`,
    `transaction_session_${transactionId}`,
    `pending_transaction_${Date.now()}`,
    `latest_transaction`
  ];
  
  // Store in localStorage
  storageKeys.forEach(key => {
    try {
      localStorage.setItem(key, transactionData);
    } catch (e) {
      console.error(`❌ Failed to store in localStorage with key ${key}:`, e);
    }
  });
  
  // Store in sessionStorage as well
  try {
    sessionStorage.setItem(`transaction_session_${transactionId}`, transactionData);
    sessionStorage.setItem('lastTransactionId', transactionId);
  } catch (e) {
    console.error('❌ Error storing in sessionStorage:', e);
  }
  
  // Store with window object as last resort
  try {
    // @ts-ignore - Using window as emergency backup
    window.__EMERGENCY_TRANSACTION = transactionData;
  } catch (e) {
    console.error('❌ Error storing in window object:', e);
  }
  
  // Verify storage success
  console.log('🔍 Verifying data was successfully stored...');
  
  let storageVerified = false;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (!storageVerified && attempts < maxAttempts) {
    attempts++;
    
    // Check multiple storage locations
    const storedData = [
      localStorage.getItem(`transaction_${transactionId}`),
      localStorage.getItem(`transaction_backup_${transactionId}`),
      sessionStorage.getItem(`transaction_session_${transactionId}`)
    ];
    
    // If any storage method succeeded, we're good
    storageVerified = storedData.some(data => !!data);
    
    if (!storageVerified) {
      console.log(`⚠️ Storage verification failed on attempt ${attempts}/${maxAttempts}, retrying...`);
      
      // Try storage again with all methods
      storageKeys.forEach(key => {
        try {
          localStorage.setItem(key, transactionData);
        } catch (e) {}
      });
      
      try {
        sessionStorage.setItem(`transaction_session_${transactionId}`, transactionData);
        sessionStorage.setItem('lastTransactionId', transactionId);
      } catch (e) {}
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return {
    success: true,
    verified: storageVerified,
    attempts
  };
};

/**
 * Creates and displays a loading indicator on the page
 * @returns The created loading div element
 */
export const createLoadingIndicator = (): HTMLDivElement => {
  const loadingDiv = document.createElement('div');
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '0';
  loadingDiv.style.left = '0';
  loadingDiv.style.width = '100%';
  loadingDiv.style.height = '100%';
  loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
  loadingDiv.style.display = 'flex';
  loadingDiv.style.justifyContent = 'center';
  loadingDiv.style.alignItems = 'center';
  loadingDiv.style.zIndex = '10000';
  loadingDiv.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
      <h3>Preparing Secure Payment...</h3>
      <p>Please wait while we securely prepare your transaction.</p>
    </div>
  `;
  document.body.appendChild(loadingDiv);
  return loadingDiv;
};

/**
 * Removes a loading indicator from the page
 * @param loadingDiv The loading div element to remove
 */
export const removeLoadingIndicator = (loadingDiv: HTMLDivElement): void => {
  if (loadingDiv && document.body.contains(loadingDiv)) {
    document.body.removeChild(loadingDiv);
  }
};
