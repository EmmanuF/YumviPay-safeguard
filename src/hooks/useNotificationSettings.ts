
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

export interface NotificationSettings {
  transactions: boolean;
  marketing: boolean;
  updates: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const NOTIFICATION_SETTINGS_KEY = 'yumvi_notification_settings';

const defaultSettings: NotificationSettings = {
  transactions: true,
  marketing: false,
  updates: true,
  email: true,
  push: true,
  sms: true
};

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { value } = await Preferences.get({ key: NOTIFICATION_SETTINGS_KEY });
        if (value) {
          setSettings(JSON.parse(value));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading notification settings:', error);
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage
  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await Preferences.set({
        key: NOTIFICATION_SETTINGS_KEY,
        value: JSON.stringify(newSettings)
      });
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return false;
    }
  };

  // Update a single setting
  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    return await saveSettings(newSettings);
  };

  // Reset to default settings
  const resetSettings = async () => {
    return await saveSettings(defaultSettings);
  };

  return {
    settings,
    loading,
    updateSetting,
    saveSettings,
    resetSettings
  };
};
