
import { Preferences } from '@capacitor/preferences';

// Keys for preferences storage
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

/**
 * A simplified biometric service that simulates biometric authentication
 * This can be replaced with actual biometric plugin implementation later
 */
export const BiometricService = {
  /**
   * Check if biometric authentication is available on the device
   * In a real implementation, this would check device capabilities
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      // For now, simulate that biometrics are always available on mobile devices
      // In a real implementation, this would check the device capabilities
      return true;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  },

  /**
   * Check if biometric authentication is enabled by the user
   */
  isEnabled: async (): Promise<boolean> => {
    try {
      const { value } = await Preferences.get({ key: BIOMETRIC_ENABLED_KEY });
      return value === 'true';
    } catch (error) {
      console.error('Error checking if biometrics are enabled:', error);
      return false;
    }
  },

  /**
   * Enable or disable biometric authentication
   */
  setEnabled: async (enabled: boolean): Promise<void> => {
    try {
      await Preferences.set({
        key: BIOMETRIC_ENABLED_KEY,
        value: enabled.toString(),
      });
      console.log(`Biometric authentication ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error setting biometric enabled status:', error);
      throw new Error('Failed to update biometric settings');
    }
  },

  /**
   * Authenticate using biometrics
   * In a real implementation, this would use the native biometric APIs
   */
  authenticate: async (): Promise<boolean> => {
    try {
      // For demonstration purposes, simulate successful authentication
      // In a real implementation, this would show the native biometric prompt
      console.log('Simulating biometric authentication...');
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always return success for the simulation
      return true;
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return false;
    }
  }
};
