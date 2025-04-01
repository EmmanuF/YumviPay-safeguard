
import type { PlatformType } from './types';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * Detects whether the app is running on a specific platform
 * 
 * @param platform The platform to check for
 * @returns Boolean indicating whether the app is running on the specified platform
 */
export const isPlatform = (platform: PlatformType): boolean => {
  switch (platform) {
    case 'ios':
      return Capacitor.getPlatform() === 'ios';
    case 'android':
      return Capacitor.getPlatform() === 'android';
    case 'native':
      return Capacitor.isNativePlatform();
    case 'desktop':
      return !Capacitor.isNativePlatform() && window.innerWidth >= 1024;
    case 'mobile':
      return window.innerWidth < 768;
    case 'tablet':
      return window.innerWidth >= 768 && window.innerWidth < 1024;
    case 'pwa':
      return window.matchMedia('(display-mode: standalone)').matches;
    case 'web':
      return !Capacitor.isNativePlatform();
    case 'capacitor':
      return Capacitor.isNativePlatform();
    default:
      return false;
  }
};
