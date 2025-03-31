
import { useState, useEffect } from 'react';
import { detectDeviceCapabilities, type DeviceInfo } from '@/utils/device/deviceDetection';
import { 
  getOptimizedAnimationSettings, 
  shouldUseHeavyAnimations, 
  getOptimizationClasses,
  getGlassEffectIntensity,
  type AnimationSettings
} from '@/utils/device/animationOptimizations';
import { 
  getOptimizedNetworkSettings, 
  type NetworkSettings 
} from '@/utils/device/networkOptimizations';

/**
 * Hook for managing device-specific optimizations with enhanced security
 */
export function useDeviceOptimizations() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isLowPerformance: false,
    isLowBandwidth: false,
    isCapacitor: false,
    batteryLevel: 1.0,
    platform: 'web',
    isSecureContext: true,
    hasHardwareSecurityFeatures: false,
    supportsEncryption: false
  });

  // Glass effect intensity based on device capabilities
  const [glassEffectIntensity, setGlassEffectIntensity] = useState<'none' | 'light' | 'full'>('full');

  // Get device info on mount
  useEffect(() => {
    async function initializeDeviceCapabilities() {
      const detectedDeviceInfo = await detectDeviceCapabilities();
      setDeviceInfo(detectedDeviceInfo);
      
      // Set glass effect intensity based on device capabilities
      setGlassEffectIntensity(getGlassEffectIntensity(detectedDeviceInfo));
      
      // Setup battery monitoring if available
      if ('getBattery' in navigator) {
        try {
          // @ts-ignore
          const battery = await navigator.getBattery();
          
          // Update battery level when it changes
          battery.addEventListener('levelchange', () => {
            setDeviceInfo(prev => ({
              ...prev,
              batteryLevel: battery.level
            }));
          });
        } catch (e) {
          console.error('Error setting up battery monitoring:', e);
        }
      }
    }

    initializeDeviceCapabilities();
  }, []);
  
  return {
    deviceInfo,
    getOptimizedAnimationSettings: () => getOptimizedAnimationSettings(deviceInfo),
    getOptimizedNetworkSettings: () => getOptimizedNetworkSettings(deviceInfo),
    shouldUseHeavyAnimations: () => shouldUseHeavyAnimations(deviceInfo),
    // Alias for better naming in components (compatibility with existing usage)
    shouldUseComplexAnimations: () => shouldUseHeavyAnimations(deviceInfo),
    getOptimizationClasses: () => getOptimizationClasses(deviceInfo),
    glassEffectIntensity,
    // Security-related helpers
    isSecureContext: deviceInfo.isSecureContext,
    hasHardwareSecurityFeatures: deviceInfo.hasHardwareSecurityFeatures,
    supportsEncryption: deviceInfo.supportsEncryption
  };
}
