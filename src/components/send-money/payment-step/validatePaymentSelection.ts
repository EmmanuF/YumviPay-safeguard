
/**
 * Validates the payment selection before proceeding to the next step
 */
export const validatePaymentSelection = (
  paymentMethod: string | null,
  selectedProvider: string | undefined,
  isDetailsConfirmed: boolean,
  comingSoonMethods: string[],
  comingSoonProviders: string[]
) => {
  console.log("Validating payment selection:", {
    paymentMethod,
    selectedProvider,
    isDetailsConfirmed
  });

  // Check if payment method is selected
  if (!paymentMethod) {
    return {
      isValid: false,
      errorToast: {
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive"
      }
    };
  }

  // Check if provider is selected
  if (!selectedProvider) {
    return {
      isValid: false,
      errorToast: {
        title: "Provider Required",
        description: "Please select a payment provider to continue.",
        variant: "destructive"
      }
    };
  }

  // Check if coming soon method/provider was selected
  if (comingSoonMethods.includes(paymentMethod)) {
    return {
      isValid: false,
      errorToast: {
        title: "Method Not Available",
        description: "This payment method will be available soon. Please select another method.",
        variant: "destructive"
      }
    };
  }

  if (comingSoonProviders.includes(selectedProvider)) {
    return {
      isValid: false,
      errorToast: {
        title: "Provider Not Available",
        description: "This provider will be available soon. Please select another provider.",
        variant: "destructive"
      }
    };
  }

  // Check if user confirmed the details
  if (!isDetailsConfirmed) {
    return {
      isValid: false,
      errorToast: {
        title: "Confirmation Required",
        description: "Please confirm the recipient details to continue.",
        variant: "destructive"
      }
    };
  }

  // Everything is valid
  return { isValid: true };
};

/**
 * Sets up recurring payment if needed
 */
export const setupRecurringPayment = async (
  isRecurring: boolean,
  transactionData: any,
  recurringFrequency: string
) => {
  if (!isRecurring) {
    return { success: true, message: "One-time payment" };
  }

  try {
    console.log("Setting up recurring payment:", {
      isRecurring,
      frequency: recurringFrequency,
      transaction: transactionData
    });

    // For now, just return success since we don't have the backend implementation yet
    return {
      success: true,
      message: `Recurring payment will be sent ${recurringFrequency}.`
    };
  } catch (error) {
    console.error("Error setting up recurring payment:", error);
    return {
      success: false,
      message: "Failed to set up recurring payment. Please try again."
    };
  }
};
