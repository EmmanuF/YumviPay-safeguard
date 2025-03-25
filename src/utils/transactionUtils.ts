
import { toast } from "@/hooks/use-toast";

// Generate a random transaction ID
export const generateTransactionId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Calculate fee (always returns 0 since transactions are free)
export const calculateFee = (amount: string, country: string): string => {
  return "0.00";
};

// Calculate total amount (equal to amount since fees are free)
export const calculateTotal = (amount: string, fee: string): string => {
  const numAmount = parseFloat(amount);
  return numAmount.toFixed(2);
};

// Get estimated delivery based on destination country and payment method
export const getEstimatedDelivery = (country: string, paymentMethod: string): string => {
  if (paymentMethod.includes('mobile_money')) {
    return 'Instant to 5 minutes';
  } else if (paymentMethod.includes('bank_transfer')) {
    return 'Instant to 15 minutes';
  } else {
    return 'Instant to 30 minutes';
  }
};

// Utility function to show toast notifications
export const showToast = (title: string, description: string, variant?: "default" | "destructive") => {
  toast({
    title,
    description,
    variant,
  });
};

// Utility function to get consistent transaction amount from multiple sources
export const getConsistentAmount = (
  transactionData: any, 
  fallbackToStorage: boolean = true
): number => {
  // Try multiple sources in order of preference
  if (transactionData?.sendAmount && !isNaN(parseFloat(transactionData.sendAmount))) {
    return parseFloat(transactionData.sendAmount);
  }
  
  if (transactionData?.amount && !isNaN(parseFloat(transactionData.amount.toString()))) {
    return parseFloat(transactionData.amount.toString());
  }
  
  // Only check localStorage if fallbackToStorage is true
  if (fallbackToStorage) {
    const lastAmount = localStorage.getItem('lastTransactionAmount');
    if (lastAmount && !isNaN(parseFloat(lastAmount))) {
      return parseFloat(lastAmount);
    }
  }
  
  // Default value if all else fails
  return 0;
};

// Utility function to consistently calculate converted amount
export const calculateConvertedAmount = (amount: number, exchangeRate: number = 610): number => {
  return amount * exchangeRate;
};

// Utility to ensure transaction data is consistent
export const normalizeTransactionData = (data: any): any => {
  if (!data) return null;
  
  // Get consistent amount
  const amount = getConsistentAmount(data);
  
  // Use exchange rate from data or default
  const exchangeRate = data.exchangeRate || 610;
  
  // Calculate converted amount
  const convertedAmount = calculateConvertedAmount(amount, exchangeRate);
  
  // Return normalized data
  return {
    ...data,
    amount: amount,
    sendAmount: amount.toString(),
    convertedAmount: convertedAmount,
    receiveAmount: convertedAmount.toString(),
    exchangeRate: exchangeRate,
  };
};
