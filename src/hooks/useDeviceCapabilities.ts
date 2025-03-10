
import { useState, useEffect } from 'react';
import { Device, DeviceInfo } from '@capacitor/device';
import { App, AppInfo } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * Hook to access device capabilities and information
 */
export const useDeviceCapabilities = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [isNative, setIsNative] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDeviceInfo = async () => {
      try {
        const info = await Device.getInfo();
        setDeviceInfo(info);
        
        // If running in a Capacitor environment, platform will be 'ios' or 'android'
        setIsNative(info.platform !== 'web');
        
        const app = await App.getInfo();
        setAppInfo(app);
      } catch (error) {
        console.error('Error loading device info:', error);
        // Likely running in a browser environment
        setIsNative(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDeviceInfo();
  }, []);
  
  /**
   * Trigger haptic feedback
   * @param style Impact style (light, medium, heavy)
   */
  const triggerHapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (!isNative) return;
    
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  };
  
  /**
   * Check if biometric authentication is available
   */
  const isBiometricAvailable = async (): Promise<boolean> => {
    if (!isNative) return false;
    
    try {
      // This is a simplified check - in a real app you would use
      // a proper biometric plugin to check availability
      return deviceInfo?.platform === 'ios' || deviceInfo?.platform === 'android';
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  };
  
  return {
    deviceInfo,
    appInfo,
    isNative,
    isLoading,
    triggerHapticFeedback,
    isBiometricAvailable
  };
};
