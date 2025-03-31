
import { useState, useEffect } from 'react';
import { isPlatform } from '@/utils/platformUtils';

// Animation settings adjustment based on device
export interface AnimationSettings {
  duration: number;
  enabled: boolean;
  complexity: 'simple' | 'normal' | 'complex';
  // Add missing properties
  stiffness: number;
  damping: number;
}

// Network optimization settings
interface NetworkSettings {
  prefetch: boolean;
  cacheTime: number; // in milliseconds
  staleTime: number; // in milliseconds
}

export function useDeviceOptimizations() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowPerformance: false,
    isLowBandwidth: false,
    isCapacitor: false,
    batteryLevel: 1.0, // Default to fully charged
    platform: 'web',
  });

  // Glass effect intensity based on device capabilities
  const [glassEffectIntensity, setGlassEffectIntensity] = useState<'none' | 'light' | 'full'>('full');

  // Get device info on mount
  useEffect(() => {
    async function detectDeviceCapabilities() {
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
          isLowPerformance = info.platform === 'android' && (info.osVersion?.startsWith('5') || info.osVersion?.startsWith('6'));
          
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
            // @ts-ignore
            const battery = await navigator.getBattery();
            batteryLevel = battery.level;
            
            // Update battery level when it changes
            battery.addEventListener('levelchange', () => {
              setDeviceInfo(prev => ({
                ...prev,
                batteryLevel: battery.level
              }));
            });
          }
        } catch (e) {
          console.error('Error detecting browser capabilities:', e);
        }
      }

      setDeviceInfo({
        isMobile,
        isLowPerformance,
        isLowBandwidth,
        isCapacitor,
        batteryLevel,
        platform,
      });
      
      // Set glass effect intensity based on device capabilities
      if (isLowPerformance || (isMobile && batteryLevel < 0.2)) {
        setGlassEffectIntensity('light');
      } else if (isLowPerformance && batteryLevel < 0.1) {
        setGlassEffectIntensity('none');
      } else {
        setGlassEffectIntensity('full');
      }
    }

    detectDeviceCapabilities();
  }, []);

  // Get animation settings optimized for the current device
  const getOptimizedAnimationSettings = (): AnimationSettings => {
    // Disable animations for low performance devices with low battery
    const shouldDisableAnimations = 
      (deviceInfo.isLowPerformance && deviceInfo.batteryLevel < 0.2) || 
      (deviceInfo.isCapacitor && deviceInfo.batteryLevel < 0.1);

    // Reduce animation duration for mobile devices
    const duration = deviceInfo.isMobile ? 0.3 : 0.5;
    
    // Reduce complexity for low performance devices
    const complexity = deviceInfo.isLowPerformance ? 'simple' : 'normal';
    
    // Add stiffness and damping values based on device capabilities
    const stiffness = deviceInfo.isLowPerformance ? 100 : 300;
    const damping = deviceInfo.isLowPerformance ? 30 : 24;
    
    return {
      duration,
      enabled: !shouldDisableAnimations,
      complexity,
      stiffness,
      damping
    };
  };

  // Get network settings optimized for the current device
  const getOptimizedNetworkSettings = (): NetworkSettings => {
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
  };

  // Check if heavy animations should be enabled
  const shouldUseHeavyAnimations = (): boolean => {
    return (
      !deviceInfo.isLowPerformance && 
      !deviceInfo.isLowBandwidth && 
      deviceInfo.batteryLevel > 0.3
    );
  };
  
  // Alias for better naming in components (compatibility with existing usage)
  const shouldUseComplexAnimations = shouldUseHeavyAnimations;
  
  // Generate optimization CSS classes based on device capabilities
  const getOptimizationClasses = (): string => {
    const classes = [];
    
    if (deviceInfo.isLowPerformance) {
      classes.push('low-performance');
    }
    
    if (deviceInfo.isLowBandwidth) {
      classes.push('low-bandwidth');
    }
    
    if (deviceInfo.batteryLevel < 0.3) {
      classes.push('battery-saving');
    }
    
    if (deviceInfo.platform === 'ios') {
      classes.push('ios-device');
    } else if (deviceInfo.platform === 'android') {
      classes.push('android-device');
    }
    
    return classes.join(' ');
  };

  return {
    deviceInfo,
    getOptimizedAnimationSettings,
    getOptimizedNetworkSettings,
    shouldUseHeavyAnimations,
    shouldUseComplexAnimations,
    getOptimizationClasses,
    glassEffectIntensity
  };
}
