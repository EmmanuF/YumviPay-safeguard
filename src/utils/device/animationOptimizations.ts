
import type { DeviceInfo } from './deviceDetection';

// Animation settings adjustment based on device
export interface AnimationSettings {
  duration: number;
  enabled: boolean;
  complexity: 'simple' | 'normal' | 'complex';
  stiffness: number;
  damping: number;
}

/**
 * Get animation settings optimized for the current device
 */
export function getOptimizedAnimationSettings(deviceInfo: DeviceInfo): AnimationSettings {
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
}

/**
 * Check if heavy animations should be enabled
 */
export function shouldUseHeavyAnimations(deviceInfo: DeviceInfo): boolean {
  return (
    !deviceInfo.isLowPerformance && 
    !deviceInfo.isLowBandwidth && 
    deviceInfo.batteryLevel > 0.3
  );
}

/**
 * Generate optimization CSS classes based on device capabilities
 */
export function getOptimizationClasses(deviceInfo: DeviceInfo): string {
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
}

/**
 * Determine glass effect intensity based on device capabilities
 */
export function getGlassEffectIntensity(deviceInfo: DeviceInfo): 'none' | 'light' | 'full' {
  if (deviceInfo.isLowPerformance && deviceInfo.batteryLevel < 0.1) {
    return 'none';
  } else if (deviceInfo.isLowPerformance || (deviceInfo.isMobile && deviceInfo.batteryLevel < 0.2)) {
    return 'light';
  } else {
    return 'full';
  }
}
