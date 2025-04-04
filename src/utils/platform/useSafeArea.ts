
import { useState, useEffect } from 'react';
import { isPlatform } from './isPlatform';

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
