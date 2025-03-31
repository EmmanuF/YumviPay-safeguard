
import type { DeviceInfo } from './deviceDetection';

// Network optimization settings with enhanced security options
export interface NetworkSettings {
  prefetch: boolean;
  cacheTime: number; // in milliseconds
  staleTime: number; // in milliseconds
  secureFetch: boolean; // Whether to enforce HTTPS
  dataEncryption: boolean; // Whether to encrypt cached data
}

/**
 * Get network settings optimized for the current device with security enhancements
 */
export function getOptimizedNetworkSettings(deviceInfo: DeviceInfo): NetworkSettings {
  // Increase cache time for mobile devices
  const cacheTime = deviceInfo.isMobile ? 
    (24 * 60 * 60 * 1000) : // 24 hours for mobile
    (30 * 60 * 1000); // 30 minutes for desktop
    
  // Disable prefetching for low bandwidth connections
  const prefetch = !deviceInfo.isLowBandwidth;
  
  // Increase stale time for low battery devices
  const staleTime = deviceInfo.batteryLevel < 0.3 ?
    (60 * 60 * 1000) : // 1 hour for low battery
    (5 * 60 * 1000); // 5 minutes otherwise
  
  // Always enable secure fetch for sensitive operations
  // Only disable for explicitly marked public API endpoints
  const secureFetch = true;
  
  // Enable data encryption for cached sensitive data on mobile devices
  // This helps protect offline data in case of device theft
  const dataEncryption = deviceInfo.isMobile || deviceInfo.isCapacitor;
    
  return {
    cacheTime,
    prefetch,
    staleTime,
    secureFetch,
    dataEncryption
  };
}
