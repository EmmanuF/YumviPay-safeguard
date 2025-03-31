
/**
 * Platform types that can be detected
 */
export type PlatformType = 
  | 'web' 
  | 'capacitor'
  | 'mobile' 
  | 'desktop'
  | 'ios'
  | 'android'
  | 'pwa'
  | 'native';

/**
 * Check if the app is running on a specific platform
 * 
 * @param platform Platform to check
 * @returns Boolean indicating if the app is running on the specified platform
 */
export function isPlatform(platform: PlatformType): boolean {
  // For Capacitor detection
  const isCapacitorNative = typeof window !== 'undefined' && 
                            typeof (window as any).Capacitor !== 'undefined' && 
                            (window as any).Capacitor.isNativePlatform;
  
  // For PWA detection
  const isPwa = typeof window !== 'undefined' && 
                window.matchMedia && 
                (window.matchMedia('(display-mode: standalone)').matches || 
                 window.matchMedia('(display-mode: fullscreen)').matches ||
                 (window.navigator as any).standalone === true);
  
  // For mobile detection using user agent
  const isMobileDevice = typeof navigator !== 'undefined' && 
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Specific iOS detection
  const isIos = typeof navigator !== 'undefined' && 
               /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Specific Android detection
  const isAndroid = typeof navigator !== 'undefined' && 
                   /Android/i.test(navigator.userAgent);

  // Determine if this is a desktop device (not mobile)
  const isDesktop = typeof navigator !== 'undefined' && !isMobileDevice;
  
  switch (platform) {
    case 'capacitor':
      return isCapacitorNative;
    case 'mobile':
      return isMobileDevice || isCapacitorNative;
    case 'desktop':
      return isDesktop && !isCapacitorNative;
    case 'pwa':
      return isPwa;
    case 'ios':
      return isIos || (isCapacitorNative && (window as any).Capacitor?.getPlatform() === 'ios');
    case 'android':
      return isAndroid || (isCapacitorNative && (window as any).Capacitor?.getPlatform() === 'android');
    case 'native':
      return isCapacitorNative || (isPlatform('ios') || isPlatform('android'));
    case 'web':
      return !isCapacitorNative;
    default:
      return false;
  }
}
