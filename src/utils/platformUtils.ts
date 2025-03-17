
import { Capacitor } from '@capacitor/core';

/**
 * Platform types that can be checked
 */
export type PlatformType = 'web' | 'android' | 'ios' | 'mobile' | 'native';

/**
 * Check if the app is running on a specific platform
 * @param platform - The platform to check for
 * @returns True if running on the specified platform
 */
export const isPlatform = (platform: PlatformType): boolean => {
  switch (platform) {
    case 'web':
      return !Capacitor.isNativePlatform();
    case 'android':
      return Capacitor.getPlatform() === 'android';
    case 'ios':
      return Capacitor.getPlatform() === 'ios';
    case 'mobile':
    case 'native':
      return Capacitor.isNativePlatform();
    default:
      return false;
  }
};

/**
 * Get the current platform
 * @returns The platform name ('ios', 'android', or 'web')
 */
export const getCurrentPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};
