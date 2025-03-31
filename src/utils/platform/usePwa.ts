
import { isPlatform } from './isPlatform';

/**
 * Hook to detect if the app is installed as a PWA
 */
export function useIsPwa() {
  return isPlatform('pwa');
}

/**
 * Hook to detect if the app is running in a native environment
 */
export function useIsNative() {
  return isPlatform('native');
}
