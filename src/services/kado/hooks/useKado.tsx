
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { kadoRedirectService } from '../redirect';
import type { KadoRedirectParams } from '../types';

/**
 * Hook for interacting with Kado payment services
 */
export function useKado() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const redirectToKadoAndReturn = useCallback(async (params: KadoRedirectParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Redirecting to Kado with params:', params);
      await kadoRedirectService.redirectToKado(params);
      return { success: true };
    } catch (err) {
      console.error('Error redirecting to Kado:', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast.error("Payment Gateway Error", {
        description: error.message || "Could not connect to payment provider",
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkApiConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API connectivity check to Kado
      console.log('Checking API connection to Kado...');
      
      // For demo purposes, simulate a successful API check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { connected: true };
    } catch (err) {
      console.error('API connection check failed:', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { connected: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    redirectToKadoAndReturn,
    checkApiConnection,
    isLoading,
    error
  };
}
