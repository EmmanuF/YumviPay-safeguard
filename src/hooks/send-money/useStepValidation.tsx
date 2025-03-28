
import { toast } from 'sonner';

export const useStepValidation = () => {
  const validateRecipientStep = (transactionData: any): boolean => {
    if (!transactionData) return false;
    
    const pendingTransaction = localStorage.getItem('pendingTransaction');
    if (pendingTransaction) {
      const data = JSON.parse(pendingTransaction);
      
      if (!data.nameMatchConfirmed) {
        toast.error("Confirmation Required", {
          description: "Please confirm that the recipient details match their official ID before proceeding.",
        });
        return false;
      }
    }
    
    return true;
  };

  const validatePaymentStep = (transactionData: any): boolean => {
    if (!transactionData) return false;
    
    const paymentTransaction = localStorage.getItem('pendingTransaction');
    if (paymentTransaction) {
      const data = JSON.parse(paymentTransaction);
      
      if (!data.nameMatchConfirmed) {
        toast.error("Confirmation Required", {
          description: "Please confirm that the recipient details are correct before proceeding.",
        });
        return false;
      }
    }
    
    return true;
  };

  return {
    validateRecipientStep,
    validatePaymentStep
  };
};
