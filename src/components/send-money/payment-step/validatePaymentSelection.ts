
import { createRecurringPayment } from '@/services/recurringPayments';
import { ToastActionElement } from '@/components/ui/toast';

interface ValidationResult {
  isValid: boolean;
  errorToast?: {
    title: string;
    description: string;
    variant?: "default" | "destructive";
    action?: ToastActionElement;
  };
}

export const validatePaymentSelection = (
  paymentMethod: string | null,
  selectedProvider: string | undefined,
  isDetailsConfirmed: boolean,
  comingSoonMethods: string[],
  comingSoonProviders: string[]
): ValidationResult => {
  if (paymentMethod && comingSoonMethods.includes(paymentMethod)) {
    return {
      isValid: false,
      errorToast: {
        title: "Coming Soon",
        description: "This payment method will be available soon. Please select Mobile Money for now.",
        variant: "default",
      }
    };
  }
  
  if (selectedProvider && comingSoonProviders.includes(selectedProvider)) {
    return {
      isValid: false,
      errorToast: {
        title: "Coming Soon",
        description: "This payment provider will be available soon. Please select MTN Mobile Money or Orange Money.",
        variant: "default",
      }
    };
  }

  if (!paymentMethod || !selectedProvider) {
    return {
      isValid: false,
      errorToast: {
        title: "Payment method required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      }
    };
  }
  
  if (!isDetailsConfirmed) {
    return {
      isValid: false,
      errorToast: {
        title: "Confirmation required",
        description: "Please confirm that the recipient details match what's registered with the payment provider.",
        variant: "destructive",
      }
    };
  }
  
  return { isValid: true };
};

export const setupRecurringPayment = async (
  isRecurring: boolean,
  transactionData: any,
  recurringFrequency: string
): Promise<{ success: boolean, message?: string }> => {
  if (!isRecurring || !transactionData.recipient) {
    return { success: true };
  }
  
  try {
    await createRecurringPayment(
      transactionData.recipient,
      transactionData.amount.toString(),
      transactionData.targetCurrency,
      transactionData.paymentMethod,
      transactionData.selectedProvider || '',
      recurringFrequency
    );
    
    return { 
      success: true, 
      message: `Your payment will be processed ${recurringFrequency} until cancelled.` 
    };
  } catch (error) {
    console.error('Error setting up recurring payment:', error);
    return { 
      success: false, 
      message: "We'll still process this one-time payment." 
    };
  }
};
