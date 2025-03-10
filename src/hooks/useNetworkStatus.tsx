
import { useState, useEffect } from 'react';

type NetworkStatus = 'online' | 'offline';

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>(
    typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline'
  );
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(
    status === 'online' ? new Date() : null
  );

  useEffect(() => {
    const handleOnline = () => {
      setStatus('online');
      setLastOnlineAt(new Date());
      console.info('Network connection restored');
    };

    const handleOffline = () => {
      setStatus('offline');
      console.warn('Network connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline: status === 'online',
    isOffline: status === 'offline',
    status,
    lastOnlineAt,
  };
}
