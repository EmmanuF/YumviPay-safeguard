
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';

const BIOMETRIC_ENABLED_KEY = 'biometric_auth_enabled';
const BIOMETRIC_CREDENTIALS_PREFIX = 'bio_cred_';

/**
 * Service to handle biometric authentication functionality
 */
export const BiometricService = {
  /**
   * Check if biometric authentication is available on the device
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      const info = await Device.getInfo();
      // Biometrics generally available on iOS and Android
      return info.platform === 'ios' || info.platform === 'android';
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
        value: enabled ? 'true' : 'false',
      });
    } catch (error) {
      console.error('Error setting biometric enabled status:', error);
      throw error;
    }
  },
  
  /**
   * Store credentials for biometric authentication
   */
  storeCredentials: async (username: string, password: string): Promise<void> => {
    if (!username || !password) {
      console.warn('Cannot store empty credentials');
      return;
    }
    
    try {
      // Store credentials in secure storage
      // Note: In a production app, this should be more secure
      await Preferences.set({
        key: `${BIOMETRIC_CREDENTIALS_PREFIX}username`,
        value: username,
      });
      
      await Preferences.set({
        key: `${BIOMETRIC_CREDENTIALS_PREFIX}password`,
        value: password,
      });
    } catch (error) {
      console.error('Error storing credentials:', error);
      throw error;
    }
  },
  
  /**
   * Retrieve stored credentials
   */
  getStoredCredentials: async (): Promise<{ username: string; password: string } | null> => {
    try {
      const usernameResult = await Preferences.get({ 
        key: `${BIOMETRIC_CREDENTIALS_PREFIX}username` 
      });
      
      const passwordResult = await Preferences.get({ 
        key: `${BIOMETRIC_CREDENTIALS_PREFIX}password` 
      });
      
      if (usernameResult.value && passwordResult.value) {
        return {
          username: usernameResult.value,
          password: passwordResult.value,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error retrieving stored credentials:', error);
      return null;
    }
  },
  
  /**
   * Perform the biometric authentication
   * Note: This is a simplified version for prototype purposes
   * In a real app, we would use a proper native biometric plugin
   */
  authenticate: async (): Promise<boolean> => {
    try {
      const isAvailable = await BiometricService.isAvailable();
      const isEnabled = await BiometricService.isEnabled();
      
      if (!isAvailable || !isEnabled) {
        return false;
      }
      
      // Since we can't use the native plugin, we'll simulate success for now
      // In a real implementation, this would integrate with the native biometric APIs
      
      // This is where you would normally call the native biometric API
      // For now, we'll just return true to simulate successful authentication
      console.log('Biometric authentication would happen here with a native plugin');
      
      return true;
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return false;
    }
  },
  
  /**
   * Clear stored credentials
   */
  clearCredentials: async (): Promise<void> => {
    try {
      await Preferences.remove({ key: `${BIOMETRIC_CREDENTIALS_PREFIX}username` });
      await Preferences.remove({ key: `${BIOMETRIC_CREDENTIALS_PREFIX}password` });
    } catch (error) {
      console.error('Error clearing credentials:', error);
      throw error;
    }
  }
};
