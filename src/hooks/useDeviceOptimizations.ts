
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export type DevicePerformance = 'high' | 'medium' | 'low';

export const useDeviceOptimizations = () => {
  const isMobile = useIsMobile();
  const [devicePerformance, setDevicePerformance] = useState<DevicePerformance>('medium');
  
  useEffect(() => {
    // Simple performance detection based on device capabilities
    const detectDevicePerformance = () => {
      // Check if the device is low-end through various signals
      const isLowEndDevice = () => {
        // Memory is a good indicator of device capability
        // @ts-ignore - navigator.deviceMemory is not in TypeScript types yet
        const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        // Check if we're on a slow CPU
        // @ts-ignore
        const slowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        // Detect mobile devices which are typically slower
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Device might be low-end if it meets any of these criteria
        return (lowMemory || slowCPU || (isMobileDevice && prefersReducedMotion));
      };
      
      // Check if device is high-end
      const isHighEndDevice = () => {
        // @ts-ignore
        const highMemory = navigator.deviceMemory && navigator.deviceMemory >= 8;
        
        // Check for powerful CPU
        // @ts-ignore
        const fastCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8;
        
        // Desktop devices are typically more powerful
        const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ));
        
        // High-end device likely meets these criteria
        return (highMemory || fastCPU || isDesktop);
      };
      
      if (isLowEndDevice()) {
        return 'low';
      } else if (isHighEndDevice()) {
        return 'high';
      }
      
      return 'medium';
    };
    
    setDevicePerformance(detectDevicePerformance() as DevicePerformance);
  }, []);
  
  // Apply specific CSS classes based on device performance
  const getOptimizationClasses = (): string => {
    let classes = '';
    
    // Always add mobile-specific optimizations on mobile
    if (isMobile) {
      classes += ' mobile-optimized';
    }
    
    // Add performance specific classes
    if (devicePerformance === 'low') {
      classes += ' low-motion';
    }
    
    // Add iOS-specific classes if needed
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      classes += ' ios-safe-bottom ios-safe-top';
    }
    
    return classes.trim();
  };
  
  // Get animation settings optimized for the device
  const getOptimizedAnimationSettings = () => {
    // Default animation settings
    const defaults = {
      duration: 0.3,
      stiffness: 260,
      damping: 20
    };
    
    // Adjust based on device performance
    switch (devicePerformance) {
      case 'low':
        return {
          duration: 0.2,
          stiffness: 170,
          damping: 26,
          // Less intensive animations for low-end devices
          shouldUseMotion: false
        };
        
      case 'medium':
        return {
          duration: 0.25,
          stiffness: 220,
          damping: 22,
          shouldUseMotion: true
        };
        
      case 'high':
        return {
          duration: 0.35,
          stiffness: 300,
          damping: 18,
          // More polished animations for high-end devices
          shouldUseMotion: true
        };
        
      default:
        return {
          ...defaults,
          shouldUseMotion: true
        };
    }
  };
  
  return {
    devicePerformance,
    isMobile,
    getOptimizationClasses,
    getOptimizedAnimationSettings,
    // Helper to determine if we should show complex animations
    shouldUseComplexAnimations: devicePerformance !== 'low',
    // Helper for glass effect intensity
    glassEffectIntensity: devicePerformance === 'low' ? 'light' : 'full'
  };
};
