
import { Preferences } from '@capacitor/preferences';
import { AUTH_STATE_KEY } from './constants';
import { getAuthState } from './session';

/**
 * Set onboarding as complete
 */
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

/**
 * Check if onboarding is complete
 * @returns Boolean indicating if onboarding is complete
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  const { hasCompletedOnboarding } = await getAuthState();
  return hasCompletedOnboarding;
};
