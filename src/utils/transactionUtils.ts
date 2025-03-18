
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
