
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';

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
      // First check if we're on a native platform
      const info = await Device.getInfo();
      if (info.platform !== 'ios' && info.platform !== 'android') {
        return false;
      }

      // Then check if biometrics are available on the device
      const result = await NativeBiometric.isAvailable();
      return result.isAvailable;
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
      // Store credentials securely using the native biometric plugin
      await NativeBiometric.setCredentials({
        username,
        password,
        server: 'app.yumvipay.com',
      });
      
      // Also set the enabled flag
      await BiometricService.setEnabled(true);
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
      const credentials = await NativeBiometric.getCredentials({
        server: 'app.yumvipay.com',
      });
      
      if (credentials && credentials.username && credentials.password) {
        return {
          username: credentials.username,
          password: credentials.password,
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
   */
  authenticate: async (): Promise<boolean> => {
    try {
      const isAvailable = await BiometricService.isAvailable();
      const isEnabled = await BiometricService.isEnabled();
      
      if (!isAvailable || !isEnabled) {
        return false;
      }
      
      // Request biometric authentication
      const result = await NativeBiometric.verifyIdentity({
        reason: 'Verify your identity',
        title: 'Biometric Authentication',
        subtitle: 'Use your fingerprint or face to authenticate',
        cancelButtonTitle: 'Cancel',
      });
      
      return result.verified;
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
      await NativeBiometric.deleteCredentials({
        server: 'app.yumvipay.com',
      });
      await BiometricService.setEnabled(false);
    } catch (error) {
      console.error('Error clearing credentials:', error);
      throw error;
    }
  }
};

/**
 * Custom hook for biometric authentication
 */
export const useBiometricAuth = () => {
  const [isAvailable, setIsAvailable] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkBiometricStatus = async () => {
      try {
        setIsLoading(true);
        const available = await BiometricService.isAvailable();
        setIsAvailable(available);
        
        if (available) {
          const enabled = await BiometricService.isEnabled();
          setIsEnabled(enabled);
        }
      } catch (error) {
        console.error('Error checking biometric status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBiometricStatus();
  }, []);

  const enableBiometrics = async (username: string, password: string): Promise<boolean> => {
    try {
      if (!isAvailable) return false;
      
      await BiometricService.storeCredentials(username, password);
      setIsEnabled(true);
      return true;
    } catch (error) {
      console.error('Error enabling biometrics:', error);
      return false;
    }
  };

  const disableBiometrics = async (): Promise<boolean> => {
    try {
      await BiometricService.clearCredentials();
      setIsEnabled(false);
      return true;
    } catch (error) {
      console.error('Error disabling biometrics:', error);
      return false;
    }
  };

  return {
    isAvailable,
    isEnabled,
    isLoading,
    enableBiometrics,
    disableBiometrics,
    authenticate: BiometricService.authenticate,
    getCredentials: BiometricService.getStoredCredentials
  };
};
