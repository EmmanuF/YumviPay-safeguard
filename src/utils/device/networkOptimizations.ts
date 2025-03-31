
import type { DeviceInfo } from './deviceDetection';

// Network optimization settings
export interface NetworkSettings {
  prefetch: boolean;
  cacheTime: number; // in milliseconds
  staleTime: number; // in milliseconds
}

/**
 * Get network settings optimized for the current device
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
    
  return {
    cacheTime,
    prefetch,
    staleTime
  };
}
