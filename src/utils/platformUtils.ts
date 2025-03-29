
/**
 * Utilities for platform detection
 */

// Platforms we support
type Platform = 'mobile' | 'web' | 'ios' | 'android' | 'capacitor' | 'native';

/**
 * Check if we're running on a specific platform
 * @param platform Platform to check for
 * @returns Boolean indicating if we're on that platform
 */
export const isPlatform = (platform: Platform): boolean => {
  // Check for mobile platforms
  if (platform === 'mobile') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // Check for iOS specifically
  if (platform === 'ios') {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  
  // Check for Android specifically
  if (platform === 'android') {
    return /Android/i.test(navigator.userAgent);
  }

  // Check for Capacitor environment
  if (platform === 'capacitor' || platform === 'native') {
    return typeof window !== 'undefined' && 
      window.hasOwnProperty('Capacitor') && 
      // @ts-ignore - Capacitor global object
      !!window.Capacitor;
  }
  
  // Default to web platform
  return platform === 'web';
};

/**
 * Get the current platform
 * @returns The detected platform
 */
export const getCurrentPlatform = (): Platform => {
  if (isPlatform('ios')) return 'ios';
  if (isPlatform('android')) return 'android';
  if (isPlatform('capacitor')) return 'capacitor';
  if (isPlatform('mobile')) return 'mobile';
  return 'web';
};

export default {
  isPlatform,
  getCurrentPlatform
};
