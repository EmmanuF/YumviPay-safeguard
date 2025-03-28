
import { useState } from 'react';
import { toast } from 'sonner';

export const useApiValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateApiConnection = async (checkApiConnectionFn: () => Promise<{ connected: boolean }>): Promise<boolean> => {
    setIsValidating(true);
    try {
      const { connected } = await checkApiConnectionFn();
      if (!connected) {
        toast.error("Connection Error", {
          description: "Could not connect to payment provider"
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("❌ API connection validation failed:", error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    isValidating,
    validateApiConnection
  };
};
