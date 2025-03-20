
import { Capacitor } from '@capacitor/core';

/**
 * Check if the app is running on a specific platform
 * @param platform 'web', 'ios', 'android', 'capacitor', 'mobile', or 'native'
 * @returns boolean indicating if the app is running on the specified platform
 */
export function isPlatform(platform: 'web' | 'ios' | 'android' | 'capacitor' | 'mobile' | 'native'): boolean {
  if (platform === 'capacitor' || platform === 'native') {
    return Capacitor.isNativePlatform();
  }
  
  if (platform === 'mobile') {
    const currentPlatform = Capacitor.getPlatform();
    return currentPlatform === 'ios' || currentPlatform === 'android';
  }
  
  if (platform === 'web') {
    return !Capacitor.isNativePlatform();
  }
  
  return Capacitor.getPlatform() === platform;
}

/**
 * Get the current platform the app is running on
 * @returns 'web', 'ios', or 'android'
 */
export function getCurrentPlatform(): 'web' | 'ios' | 'android' {
  return Capacitor.getPlatform() as 'web' | 'ios' | 'android';
}

/**
 * Check if the app is running in a production environment
 * @returns boolean
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if the app is running in development mode
 * @returns boolean
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
