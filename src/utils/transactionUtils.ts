
import { toast } from "@/hooks/use-toast";

// Generate a random transaction ID
export const generateTransactionId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Calculate fee based on amount and destination (simplified for demo)
export const calculateFee = (amount: string, country: string): string => {
  const numAmount = parseFloat(amount);
  // Base fee of $2.99 + 1.5% of amount
  const baseFee = 2.99;
  const percentageFee = numAmount * 0.015;
  return (baseFee + percentageFee).toFixed(2);
};

// Calculate total amount (amount + fee)
export const calculateTotal = (amount: string, fee: string): string => {
  const numAmount = parseFloat(amount);
  const numFee = parseFloat(fee);
  return (numAmount + numFee).toFixed(2);
};

// Get estimated delivery based on destination country and payment method
export const getEstimatedDelivery = (country: string, paymentMethod: string): string => {
  if (paymentMethod.includes('mobile_money')) {
    return 'Within 15 minutes';
  } else if (paymentMethod.includes('bank_transfer')) {
    return '1-2 business days';
  } else {
    return '1-3 business days';
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

// Resend transaction receipt to recipient's email/SMS
export const resendTransactionReceipt = async (transactionId: string): Promise<boolean> => {
  // Simulate API call to resend receipt
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      const isSuccessful = Math.random() < 0.9;
      
      if (isSuccessful) {
        showToast(
          "Receipt sent",
          "Transaction receipt has been resent successfully"
        );
        resolve(true);
      } else {
        showToast(
          "Failed to send receipt",
          "There was an error sending the receipt. Please try again.",
          "destructive"
        );
        resolve(false);
      }
    }, 2000); // Simulate 2 second delay
  });
};
