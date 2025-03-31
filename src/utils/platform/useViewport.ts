
import { useState, useEffect } from 'react';
import { isPlatform } from './isPlatform';

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
