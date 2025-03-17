
import { Preferences } from '@capacitor/preferences';
import { getAuthState } from './authState';

// Keys for storage
const AUTH_STATE_KEY = 'yumvi_auth_state';

// Set onboarding complete
export const setOnboardingComplete = async (): Promise<void> => {
  try {
    const currentState = await getAuthState();
    await Preferences.set({
      key: AUTH_STATE_KEY,
      value: JSON.stringify({
        ...currentState,
        hasCompletedOnboarding: true,
      }),
    });
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
};

// Check if onboarding is complete
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  const { hasCompletedOnboarding } = await getAuthState();
  return hasCompletedOnboarding;
};
