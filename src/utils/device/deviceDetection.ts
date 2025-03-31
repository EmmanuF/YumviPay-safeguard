
import { isPlatform } from '@/utils/platformUtils';

export interface DeviceInfo {
  isMobile: boolean;
  isLowPerformance: boolean;
  isLowBandwidth: boolean;
  isCapacitor: boolean;
  batteryLevel: number;
  platform: 'ios' | 'android' | 'web';
}

/**
 * Detects device capabilities including platform, performance, and battery status
 */
export async function detectDeviceCapabilities(): Promise<DeviceInfo> {
  // Check platform
  const isCapacitor = isPlatform('capacitor');
  const isMobile = isPlatform('mobile') || isPlatform('capacitor');
  const platform = isPlatform('ios') ? 'ios' : isPlatform('android') ? 'android' : 'web';
  
  // Start with basic detection based on platform
  let isLowPerformance = isMobile; // Assume mobile devices need optimization
  let isLowBandwidth = false;
  let batteryLevel = 1.0;

  // For native platforms, get more detailed device info
  if (isCapacitor) {
    try {
      // Try to get battery level (if available)
      const { Device } = await import('@capacitor/device');
      const batteryInfo = await Device.getBatteryInfo();
      batteryLevel = batteryInfo.batteryLevel || 1.0;
      
      // Get network status
      try {
        // Only import if we're in a Capacitor environment
        const { Network } = await import('@capacitor/network');
        const networkStatus = await Network.getStatus();
        isLowBandwidth = !networkStatus.connected || networkStatus.connectionType === 'cellular';
      } catch (e) {
        console.error('Error getting network status:', e);
      }
      
      // Add additional detection logic if necessary
      const info = await Device.getInfo();
      isLowPerformance = info.platform === 'android' && 
        (info.osVersion?.startsWith('5') || info.osVersion?.startsWith('6'));
      
      console.log('📱 Device optimization data:', {
        batteryLevel,
        platform: info.platform,
        osVersion: info.osVersion,
      });
    } catch (e) {
      console.error('Error detecting device capabilities:', e);
    }
  } else {
    // For web, use navigator information when available
    try {
      // Basic connection detection
      // @ts-ignore - Not all browsers support this
      if (navigator.connection) {
        // @ts-ignore
        isLowBandwidth = navigator.connection.saveData || 
          // @ts-ignore
          navigator.connection.effectiveType === 'slow-2g' || 
          // @ts-ignore
          navigator.connection.effectiveType === '2g';
      }
      
      // Device memory detection (Chrome)
      // @ts-ignore
      if (navigator.deviceMemory) {
        // @ts-ignore
        isLowPerformance = navigator.deviceMemory < 4;
      }
      
      // Get battery info when available
      if ('getBattery' in navigator) {
        try {
          // @ts-ignore
          const battery = await navigator.getBattery();
          batteryLevel = battery.level;
        } catch (e) {
          console.error('Error getting battery info:', e);
        }
      }
    } catch (e) {
      console.error('Error detecting browser capabilities:', e);
    }
  }

  return {
    isMobile,
    isLowPerformance,
    isLowBandwidth,
    isCapacitor,
    batteryLevel,
    platform,
  };
}
