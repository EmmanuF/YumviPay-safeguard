
/**
 * Check if the app is running on a specific platform
 * @param platform 'capacitor' | 'web' | 'ios' | 'android' | 'mobile' | 'native'
 * @returns boolean
 */
export function isPlatform(platform: 'capacitor' | 'web' | 'ios' | 'android' | 'mobile' | 'native'): boolean {
  // Simple implementation - in a real app this would detect the actual platform
  if (platform === 'web') {
    return true;
  }
  
  // For development/testing purposes
  if (platform === 'mobile' || platform === 'native') {
    // For now, mobile/native platforms return false in our simulated environment
    // In a real Capacitor app, this would check for iOS/Android
    return false;
  }
  
  // For now, we'll return false for capacitor/native platforms
  // In a real app, we would use Capacitor's Platform API
  return false;
}

/**
 * Check if the app is running on a mobile device (iOS or Android)
 * @returns boolean
 */
export function isMobileDevice(): boolean {
  return isPlatform('ios') || isPlatform('android');
}

/**
 * Check if the app is running in a Capacitor container
 * @returns boolean
 */
export function isNativeApp(): boolean {
  return isPlatform('capacitor');
}
