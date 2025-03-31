
import { useEffect, useState } from 'react';

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

/**
 * Hook to detect viewport size and device type
 */
export function useViewport() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // For mobile devices, also listen to orientation change events
    if (isPlatform('mobile')) {
      window.addEventListener('orientationchange', handleResize);
    }
    
    // Initial call to set values
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (isPlatform('mobile')) {
        window.removeEventListener('orientationchange', handleResize);
      }
    };
  }, []);
  
  const deviceType = {
    isMobile: width < 768 || isPlatform('mobile'),
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024 && !isPlatform('mobile'),
    isLandscape,
  };
  
  return {
    width,
    height,
    isLandscape,
    ...deviceType
  };
}

/**
 * Hook to get safe area insets for notches and other system UI elements
 * Primarily useful for iOS devices with notches/Dynamic Island
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateSafeArea = () => {
      // Try to get safe area insets using the CSS environment variables
      try {
        const computedStyle = window.getComputedStyle(document.documentElement);
        
        // Get the safe area insets
        const top = parseInt(computedStyle.getPropertyValue('--sat') || '0', 10);
        const right = parseInt(computedStyle.getPropertyValue('--sar') || '0', 10);
        const bottom = parseInt(computedStyle.getPropertyValue('--sab') || '0', 10);
        const left = parseInt(computedStyle.getPropertyValue('--sal') || '0', 10);
        
        setSafeArea({
          top: isNaN(top) ? 0 : top,
          right: isNaN(right) ? 0 : right,
          bottom: isNaN(bottom) ? 0 : bottom,
          left: isNaN(left) ? 0 : left
        });
      } catch (e) {
        console.error('Error getting safe area insets:', e);
      }
    };
    
    // Set CSS variables for safe area insets if on iOS
    if (isPlatform('ios')) {
      document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top, 0px)');
      document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right, 0px)');
      document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
      document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left, 0px)');
    }
    
    // Update safe area values
    updateSafeArea();
    
    window.addEventListener('resize', updateSafeArea);
    if (isPlatform('mobile')) {
      window.addEventListener('orientationchange', updateSafeArea);
    }
    
    return () => {
      window.removeEventListener('resize', updateSafeArea);
      if (isPlatform('mobile')) {
        window.removeEventListener('orientationchange', updateSafeArea);
      }
    };
  }, []);
  
  return safeArea;
}

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
