
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Smartphone, Bell, Fingerprint } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BiometricService } from '@/services/biometric';
import { PushNotificationService } from '@/services/push/pushNotificationService';
import { isPlatform } from '@/utils/platform';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

const MobileAppSettings: React.FC = () => {
  const [isPushAvailable, setIsPushAvailable] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isNative, triggerHapticFeedback } = useDeviceCapabilities();
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Check if biometrics are available and enabled
        const biometricsAvailable = await BiometricService.isAvailable();
        setIsBiometricAvailable(biometricsAvailable);
        
        if (biometricsAvailable) {
          const biometricsEnabled = await BiometricService.isEnabled();
          setIsBiometricEnabled(biometricsEnabled);
        }
        
        // Check if push notifications are available and enabled
        const pushAvailable = await PushNotificationService.isAvailable();
        setIsPushAvailable(pushAvailable);
        
        if (pushAvailable) {
          const pushEnabled = await PushNotificationService.isEnabled();
          setIsPushEnabled(pushEnabled);
        }
      } catch (error) {
        console.error('Error loading mobile app settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleTogglePushNotifications = async (checked: boolean) => {
    try {
      await PushNotificationService.setEnabled(checked);
      setIsPushEnabled(checked);
      
      // Provide haptic feedback if available
      triggerHapticFeedback();
      
      if (checked) {
        // Register for push notifications
        await PushNotificationService.register();
        
        toast({
          title: "Push notifications enabled",
          description: "You'll receive notifications for important updates",
        });
        
        // Simulate a notification to show it works
        setTimeout(() => {
          PushNotificationService.simulatePushNotification({
            title: "Notifications Active",
            body: "You will now receive push notifications from Yumvi Pay"
          });
        }, 1500);
      } else {
        toast({
          title: "Push notifications disabled",
          description: "You won't receive push notifications",
        });
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      toast({
        title: "Failed to update settings",
        description: "Could not change push notification settings",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleBiometric = async (checked: boolean) => {
    try {
      await BiometricService.setEnabled(checked);
      setIsBiometricEnabled(checked);
      
      // Provide haptic feedback if available
      triggerHapticFeedback();
      
      if (checked) {
        toast({
          title: "Biometric authentication enabled",
          description: "You can now use fingerprint or face ID to authenticate",
        });
      } else {
        // Clear stored credentials when disabling biometrics
        await BiometricService.clearCredentials();
        toast({
          title: "Biometric authentication disabled",
          description: "You will no longer use biometric authentication",
        });
      }
    } catch (error) {
      console.error('Error toggling biometric authentication:', error);
      toast({
        title: "Failed to update settings",
        description: "Could not change biometric authentication settings",
        variant: "destructive"
      });
    }
  };
  
  // If not running in a native environment, don't show this component
  if (!isNative && !isPlatform('capacitor')) {
    return null;
  }
  
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Mobile App Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }
  
  // If no mobile features are available, don't show the card
  if (!isPushAvailable && !isBiometricAvailable) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Smartphone className="w-5 h-5 mr-2" />
          Mobile App Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPushAvailable && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-primary-500" />
              <div>
                <Label htmlFor="push-notifications" className="font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive transaction updates and alerts
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={isPushEnabled}
              onCheckedChange={handleTogglePushNotifications}
            />
          </div>
        )}
        
        {isBiometricAvailable && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Fingerprint className="w-5 h-5 text-primary-500" />
              <div>
                <Label htmlFor="biometric-auth" className="font-medium">
                  Biometric Authentication
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use fingerprint or face ID to log in
                </p>
              </div>
            </div>
            <Switch
              id="biometric-auth"
              checked={isBiometricEnabled}
              onCheckedChange={handleToggleBiometric}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileAppSettings;
