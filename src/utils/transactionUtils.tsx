
import { toast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

// Generate a random transaction ID
export const generateTransactionId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Calculate fee based on amount and destination (simplified for demo)
export const calculateFee = (amount: string, country: string): string => {
  // Handle invalid amount input
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return "0.00";
  }
  
  const numAmount = parseFloat(amount);
  // Base fee of $2.99 + 1.5% of amount
  const baseFee = 2.99;
  const percentageFee = numAmount * 0.015;
  return (baseFee + percentageFee).toFixed(2);
};

// Calculate total amount (amount + fee)
export const calculateTotal = (amount: string, fee: string): string => {
  // Handle invalid inputs
  if (!amount || isNaN(parseFloat(amount)) || !fee || isNaN(parseFloat(fee))) {
    return "0.00";
  }
  
  const numAmount = parseFloat(amount);
  const numFee = parseFloat(fee);
  return (numAmount + numFee).toFixed(2);
};

// Get estimated delivery based on destination country and payment method
export const getEstimatedDelivery = (country: string, paymentMethod: string): string => {
  // Validate inputs
  if (!country || !paymentMethod) {
    return 'Estimated time unavailable';
  }
  
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

// ErrorDialog component for critical errors
export const ErrorDialog = ({ 
  isOpen, 
  setIsOpen, 
  title, 
  description, 
  actionText = "Try Again",
  onAction,
  cancelText = "Cancel"
}: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void; 
  title: string; 
  description: string;
  actionText?: string;
  onAction?: () => void;
  cancelText?: string;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          {onAction && (
            <AlertDialogAction onClick={onAction}>{actionText}</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Function to handle API errors consistently
export const handleApiError = (error: unknown): string => {
  console.error("API Error:", error);
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again later.";
};

// Resend transaction receipt to recipient's email/SMS with improved error handling
export const resendTransactionReceipt = async (transactionId: string): Promise<boolean> => {
  if (!transactionId) {
    showToast(
      "Error",
      "Invalid transaction ID. Cannot resend receipt.",
      "destructive"
    );
    return false;
  }

  try {
    // Simulate API call to resend receipt
    const response = await new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
      setTimeout(() => {
        // Simulate network conditions and server responses
        if (!navigator.onLine) {
          reject(new Error("You appear to be offline. Please check your connection."));
          return;
        }
        
        // Simulate 90% success rate
        const isSuccessful = Math.random() < 0.9;
        
        if (isSuccessful) {
          resolve({ success: true });
        } else {
          // Simulate various error scenarios
          const errors = [
            { success: false, message: "Server is currently busy. Please try again later." },
            { success: false, message: "Recipient contact information is invalid." },
            { success: false, message: "Receipt service is temporarily unavailable." }
          ];
          
          resolve(errors[Math.floor(Math.random() * errors.length)]);
        }
      }, 2000); // Simulate 2 second delay
    });
    
    if (response.success) {
      showToast(
        "Receipt sent",
        "Transaction receipt has been resent successfully"
      );
      return true;
    } else {
      showToast(
        "Failed to send receipt",
        response.message || "There was an error sending the receipt. Please try again.",
        "destructive"
      );
      return false;
    }
  } catch (error) {
    const errorMessage = handleApiError(error);
    showToast(
      "Failed to send receipt",
      errorMessage,
      "destructive"
    );
    return false;
  }
};
