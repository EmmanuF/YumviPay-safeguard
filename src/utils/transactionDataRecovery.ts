
import { toast } from 'sonner';

/**
 * Attempts to recover transaction data from various storage locations
 * @param currentStep The current step in the send money flow
 * @param updateTransactionData Function to update transaction data
 * @param cachedDataRef Optional in-memory cache reference
 * @returns An object indicating if recovery was successful and any recovered data
 */
export const recoverTransactionData = (
  currentStep: string,
  updateTransactionData: (data: any) => void,
  cachedDataRef?: React.MutableRefObject<any>
): { recovered: boolean, data?: any } => {
  try {
    // First try in-memory cache for fastest recovery
    if (cachedDataRef?.current) {
      console.log(`Recovered data from in-memory cache:`, cachedDataRef.current);
      updateTransactionData(cachedDataRef.current);
      return { recovered: true, data: cachedDataRef.current };
    }
    
    // Try local storage for current step
    const cachedStepData = localStorage.getItem(`step_${currentStep}_data`);
    if (cachedStepData) {
      const parsed = JSON.parse(cachedStepData);
      console.log(`Recovered data for step ${currentStep} from localStorage:`, parsed);
      updateTransactionData(parsed);
      
      toast.success("Data Recovered", {
        description: "Successfully recovered your transaction data",
      });
      
      return { recovered: true, data: parsed };
    }
    
    // Try to find data from any step
    const lastStep = localStorage.getItem('lastStep');
    if (lastStep) {
      const lastStepData = localStorage.getItem(`step_${lastStep}_data`);
      if (lastStepData) {
        const parsed = JSON.parse(lastStepData);
        console.log(`Recovered data from previous step ${lastStep}:`, parsed);
        updateTransactionData(parsed);
        
        toast.success("Data Recovered", {
          description: "Recovered data from your previous step",
        });
        
        return { recovered: true, data: parsed };
      }
    }
    
    // Try the pending transaction as a last resort
    const pendingTransaction = localStorage.getItem('pendingTransaction');
    if (pendingTransaction) {
      const parsed = JSON.parse(pendingTransaction);
      console.log(`Recovered data from pendingTransaction:`, parsed);
      updateTransactionData(parsed);
      
      toast.success("Data Recovered", {
        description: "Retrieved your pending transaction",
      });
      
      return { recovered: true, data: parsed };
    }
    
    return { recovered: false };
  } catch (e) {
    console.error('Error recovering step data:', e);
    return { recovered: false };
  }
};
