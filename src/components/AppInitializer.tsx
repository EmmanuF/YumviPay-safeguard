
import { useEffect, ReactNode } from 'react';
import { PushNotificationService } from '@/services/push/pushNotificationService';
import { isPlatform } from '@/utils/platformUtils';

interface AppInitializerProps {
  children?: ReactNode;
}

/**
 * Component to initialize app-wide services
 * Place this component at the root of your app
 */
const AppInitializer = ({ children }: AppInitializerProps) => {
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize native features only if running on a capacitor platform
      if (isPlatform('capacitor')) {
        console.log('Initializing native app features...');
        
        // Initialize push notification listeners
        try {
          const pushAvailable = await PushNotificationService.isAvailable();
          if (pushAvailable) {
            console.log('Setting up push notification listeners...');
            await PushNotificationService.initListeners();
          }
        } catch (error) {
          console.error('Error initializing push notifications:', error);
        }
      }
    };
    
    initializeApp();
    
    // Clean up on unmount
    return () => {
      // Remove push notification listeners when app is unmounted
      const cleanup = async () => {
        if (isPlatform('capacitor')) {
          try {
            await PushNotificationService.removeListeners();
          } catch (error) {
            console.error('Error removing listeners:', error);
          }
        }
      };
      
      cleanup();
    };
  }, []);
  
  // Return children if provided
  return children ? <>{children}</> : null;
};

export default AppInitializer;
