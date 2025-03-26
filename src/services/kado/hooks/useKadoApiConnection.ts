
import { useState, useEffect, useCallback } from 'react';
import { kadoApiService } from '../kadoApiService';

/**
 * Hook to manage Kado API connection status
 */
export const useKadoApiConnection = () => {
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  const [connectionCheckInProgress, setConnectionCheckInProgress] = useState(false);
  const [lastConnectionCheck, setLastConnectionCheck] = useState<Date | null>(null);
  
  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (connectionCheckInProgress) return;
      
      try {
        setConnectionCheckInProgress(true);
        console.log('Checking Kado API connection on mount...');
        const { connected } = await kadoApiService.checkApiConnection();
        console.log('Kado API connection check result:', connected);
        setIsApiConnected(connected);
        setLastConnectionCheck(new Date());
      } catch (error) {
        console.error('Failed to check Kado API connection:', error);
        setIsApiConnected(false);
      } finally {
        setConnectionCheckInProgress(false);
      }
    };
    
    checkConnection();
  }, []);
  
  /**
   * Check API connection with better error handling
   */
  const checkApiConnection = useCallback(async (forceCheck = false) => {
    // If we checked recently (within 30 seconds) and not forcing a check, use cached result
    if (
      !forceCheck && 
      lastConnectionCheck && 
      (new Date().getTime() - lastConnectionCheck.getTime() < 30000) && 
      isApiConnected !== null
    ) {
      console.log('Using recent API connection check result:', isApiConnected);
      return { 
        connected: isApiConnected, 
        message: isApiConnected ? 'Connected to Kado API' : 'Not connected to Kado API',
        cached: true
      };
    }
    
    if (connectionCheckInProgress) {
      console.log('Connection check already in progress, waiting...');
      // Wait for the ongoing check to complete
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (!connectionCheckInProgress) {
            clearInterval(interval);
            resolve(null);
          }
        }, 100);
      });
      
      // Return the current connection state if we already know it
      if (isApiConnected !== null) {
        return { 
          connected: isApiConnected, 
          message: isApiConnected ? 'Connected to Kado API' : 'Not connected to Kado API' 
        };
      }
    }
    
    try {
      setConnectionCheckInProgress(true);
      console.log('Checking Kado API connection...');
      
      // Try to ping the Kado API
      const response = await kadoApiService.checkApiConnection();
      setIsApiConnected(response.connected);
      setLastConnectionCheck(new Date());
      
      console.log('Kado API connection check result:', response.connected);
      return response;
    } catch (error) {
      console.error('Failed to check Kado API connection:', error);
      setIsApiConnected(false);
      setLastConnectionCheck(new Date());
      return { 
        connected: false, 
        message: 'Failed to connect to Kado API: ' + (error instanceof Error ? error.message : String(error))
      };
    } finally {
      setConnectionCheckInProgress(false);
    }
  }, [connectionCheckInProgress, isApiConnected, lastConnectionCheck]);
  
  return {
    isApiConnected,
    connectionCheckInProgress,
    lastConnectionCheck,
    checkApiConnection
  };
};
