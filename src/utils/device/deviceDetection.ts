
import { isPlatform } from '@/utils/platformUtils';

export interface DeviceInfo {
  isMobile: boolean;
  isLowPerformance: boolean;
  isLowBandwidth: boolean;
  isCapacitor: boolean;
  batteryLevel: number;
  platform: 'ios' | 'android' | 'web';
  isSecureContext: boolean; // Is running in a secure context
  hasHardwareSecurityFeatures: boolean; // Has hardware security features like Secure Enclave
  supportsEncryption: boolean; // Supports data encryption APIs
}

/**
 * Detects device capabilities including platform, performance, security features and battery status
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
  
  // Determine if we're in a secure context
  const isSecureContext = typeof window !== 'undefined' && window.isSecureContext === true;
  
  // Initializing security-related capabilities
  let hasHardwareSecurityFeatures = false;
  let supportsEncryption = false;

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
      
      // Check for hardware security features
      if (platform === 'ios') {
        // iOS devices typically have Secure Enclave
        hasHardwareSecurityFeatures = true;
        supportsEncryption = true;
      } else if (platform === 'android') {
        // Android devices vary, but newer ones typically have hardware security
        const isNewerAndroid = info.osVersion && 
          parseInt(info.osVersion.split('.')[0]) >= 8;
        hasHardwareSecurityFeatures = isNewerAndroid;
        supportsEncryption = true;
      }
      
      console.log('📱 Device security data:', {
        batteryLevel,
        platform: info.platform,
        osVersion: info.osVersion,
        isSecureContext,
        hasHardwareSecurityFeatures
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
      
      // Check for encryption support in web browsers
      supportsEncryption = typeof window.crypto !== 'undefined' && 
        typeof window.crypto.subtle !== 'undefined';
      
      // Modern secure browsers should have these features
      hasHardwareSecurityFeatures = isSecureContext && supportsEncryption;
      
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
    isSecureContext,
    hasHardwareSecurityFeatures,
    supportsEncryption
  };
}
