
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@/utils/platformUtils';
import { toast } from '@/hooks/use-toast';

const NOTIFICATION_PREF_KEY = 'push_notifications_enabled';
const DEVICE_TOKEN_KEY = 'push_notification_device_token';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  id?: string;
}

/**
 * Service to handle push notifications functionality
 */
export const PushNotificationService = {
  /**
   * Check if push notifications are available on the device
   */
  isAvailable: async (): Promise<boolean> => {
    // Check if we're on a native platform
    if (!isPlatform('capacitor')) {
      return false;
    }
    
    try {
      const info = await Device.getInfo();
      // Push notifications are available on iOS and Android
      return info.platform === 'ios' || info.platform === 'android';
    } catch (error) {
      console.error('Error checking push notification availability:', error);
      return false;
    }
  },
  
  /**
   * Check if push notifications are enabled by the user
   */
  isEnabled: async (): Promise<boolean> => {
    try {
      const { value } = await Preferences.get({ key: NOTIFICATION_PREF_KEY });
      return value === 'true';
    } catch (error) {
      console.error('Error checking if push notifications are enabled:', error);
      return false;
    }
  },
  
  /**
   * Enable or disable push notifications
   */
  setEnabled: async (enabled: boolean): Promise<void> => {
    try {
      await Preferences.set({
        key: NOTIFICATION_PREF_KEY,
        value: enabled ? 'true' : 'false',
      });
      
      if (enabled) {
        // Register for push notifications if enabled
        await PushNotificationService.register();
      }
    } catch (error) {
      console.error('Error setting push notifications enabled status:', error);
      throw error;
    }
  },
  
  /**
   * Register for push notifications
   */
  register: async (): Promise<string | null> => {
    if (!await PushNotificationService.isAvailable()) {
      console.log('Push notifications not available on this device');
      return null;
    }
    
    try {
      // Request permission
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
      }
      
      // Register with the native push notification service
      await PushNotifications.register();
      
      // Return the stored device token if we have one
      const { value } = await Preferences.get({ key: DEVICE_TOKEN_KEY });
      return value || null;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  },
  
  /**
   * Initialize push notification listeners
   * This should be called during app startup
   */
  initListeners: async (): Promise<void> => {
    if (!await PushNotificationService.isAvailable()) {
      console.log('Push notifications not available, skipping listener setup');
      return;
    }
    
    // On registration success, store the device token
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push registration success, token: ' + token.value);
      
      // Store the token for later use
      await Preferences.set({
        key: DEVICE_TOKEN_KEY,
        value: token.value
      });
      
      // Here you would typically send this token to your server
      // for server-side push notification delivery
    });
    
    // On registration error
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });
    
    // On push notification received when app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ' + JSON.stringify(notification));
      
      // Show a local toast notification
      toast({
        title: notification.title || 'New Notification',
        description: notification.body || '',
        variant: "default"
      });
    });
    
    // On push notification action
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      
      // Here you would typically handle the notification action,
      // such as navigating to a specific page in the app
    });
  },
  
  /**
   * Remove all push notification listeners
   */
  removeListeners: async (): Promise<void> => {
    if (!await PushNotificationService.isAvailable()) {
      return;
    }
    
    PushNotifications.removeAllListeners();
  },
  
  /**
   * Get the stored device token
   */
  getDeviceToken: async (): Promise<string | null> => {
    try {
      const { value } = await Preferences.get({ key: DEVICE_TOKEN_KEY });
      return value || null;
    } catch (error) {
      console.error('Error getting device token:', error);
      return null;
    }
  },
  
  /**
   * For testing only: Simulate receiving a push notification
   */
  simulatePushNotification: async (payload: PushNotificationPayload): Promise<void> => {
    console.log('Simulating push notification:', payload);
    
    // Show a toast notification
    toast({
      title: payload.title,
      description: payload.body,
      variant: "default"
    });
  }
};
