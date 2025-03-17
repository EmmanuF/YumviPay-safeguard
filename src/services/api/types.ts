
// Common types for the API service

export interface RequestOptions extends RequestInit {
  timeout?: number;
  cacheable?: boolean;
  cacheKey?: string;
  cacheTTL?: number; // in milliseconds
  retry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  forceNetwork?: boolean; // Added for offline support
  queueOffline?: boolean; // Added for offline request queueing
  kadoUserRef?: string; // Added for Kado integration
  biometricProtected?: boolean; // Added for biometric protection
  deepLinkReturn?: string; // Added for deep link return path
  usePushNotification?: boolean; // Added for push notifications
}

// Default request options
export const defaultOptions: Partial<RequestOptions> = {
  timeout: 10000, // 10 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
  },
  retry: true,
  maxRetries: 2,
  retryDelay: 500,
  queueOffline: true, // Default to queueing offline requests
  forceNetwork: false, // Default to not forcing network requests when offline
  kadoUserRef: undefined, // Default to no Kado user reference
  biometricProtected: false, // Default to not requiring biometric auth
  deepLinkReturn: undefined, // Default to no deep link return path
  usePushNotification: false // Default to not using push notifications
};
