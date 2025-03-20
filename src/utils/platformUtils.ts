
/**
 * Utility functions for platform detection
 */

// Valid platform types
export type PlatformType = 'capacitor' | 'web' | 'ios' | 'android' | 'native' | 'mobile';

// Check if running on Capacitor (native mobile) platform
export function isPlatform(platform: PlatformType): boolean {
  // On server-side rendering, we're definitely not on a native platform
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  
  // Check for Capacitor global object
  const hasCapacitor = typeof (window as any).Capacitor !== 'undefined';
  
  if (platform === 'capacitor' || platform === 'native') {
    return hasCapacitor;
  }
  
  if (platform === 'web') {
    return !hasCapacitor;
  }

  if (platform === 'mobile') {
    // This is a more general check that includes both iOS and Android
    return isPlatform('ios') || isPlatform('android');
  }
  
  // For specific platforms, check with Capacitor's isPlatform if available
  if (hasCapacitor && (window as any).Capacitor.getPlatform) {
    return (window as any).Capacitor.getPlatform().toLowerCase() === platform;
  }
  
  // Fallback to user agent checking for specific platforms
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (platform === 'ios') {
    return /iphone|ipad|ipod/.test(userAgent);
  }
  
  if (platform === 'android') {
    return /android/.test(userAgent);
  }
  
  return false;
}

// Get the current platform
export function getCurrentPlatform(): 'ios' | 'android' | 'web' {
  if (isPlatform('ios')) return 'ios';
  if (isPlatform('android')) return 'android';
  return 'web';
}

// Check if the app is running in a PWA context
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}
