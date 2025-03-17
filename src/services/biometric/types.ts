
/**
 * Biometric authentication credentials interface
 */
export interface BiometricCredentials {
  username: string;
  password: string;
}

/**
 * Return type for useBiometricAuth hook
 */
export interface BiometricAuthHook {
  isAvailable: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  enableBiometrics: (username: string, password: string) => Promise<boolean>;
  disableBiometrics: () => Promise<boolean>;
  authenticate: () => Promise<boolean>;
  getCredentials: () => Promise<BiometricCredentials | null>;
}
