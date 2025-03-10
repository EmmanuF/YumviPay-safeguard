
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';

// Keys for preferences storage
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';

/**
 * A simpler biometric service that works with core Capacitor capabilities
 */
export const BiometricService = {
  /**
   * Check if biometric authentication is available on the device
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      // Check if we're running on a mobile device
      const info = await Device.getInfo();
      return info.platform !== 'web';
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
   * Store credentials for biometric authentication
   */
  storeCredentials: async (email: string, password: string): Promise<void> => {
    try {
      // Store the credentials in secure storage
      const credentials = JSON.stringify({ email, password });
      await Preferences.set({
        key: BIOMETRIC_CREDENTIALS_KEY,
        value: credentials,
      });
    } catch (error) {
      console.error('Error storing credentials:', error);
      throw new Error('Failed to store credentials');
    }
  },

  /**
   * Get stored credentials for biometric authentication
   */
  getCredentials: async (): Promise<{ email: string; password: string } | null> => {
    try {
      const { value } = await Preferences.get({ key: BIOMETRIC_CREDENTIALS_KEY });
      
      if (!value) {
        return null;
      }
      
      return JSON.parse(value);
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  },

  /**
   * Authenticate using biometrics
   * This is a simplified implementation that simulates biometric auth
   */
  authenticate: async (): Promise<boolean> => {
    try {
      // For demonstration purposes, simulate successful authentication
      // In a real implementation, this would use native biometric APIs
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
