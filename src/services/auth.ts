
import { Preferences } from '@capacitor/preferences';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

// Default auth state
const defaultState: AuthState = {
  user: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
};

// Keys for storage
const AUTH_STATE_KEY = 'yumvi_auth_state';

// Get auth state from storage
export const getAuthState = async (): Promise<AuthState> => {
  try {
    const { value } = await Preferences.get({ key: AUTH_STATE_KEY });
    return value ? JSON.parse(value) : defaultState;
  } catch (error) {
    console.error('Error getting auth state:', error);
    return defaultState;
  }
};

// Save auth state to storage
export const saveAuthState = async (state: AuthState): Promise<void> => {
  try {
    await Preferences.set({
      key: AUTH_STATE_KEY,
      value: JSON.stringify(state),
    });
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
};

// Register a new user
export const registerUser = async (
  name: string,
  email: string,
  phone: string,
  country: string
): Promise<User> => {
  try {
    // In a real app, this would be an API call to your backend
    // For now, we'll simulate a successful registration
    const user: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      country,
    };

    // Update auth state
    const authState: AuthState = {
      user,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
    };

    await saveAuthState(authState);
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Registration failed');
  }
};

// Log out user
export const logoutUser = async (): Promise<void> => {
  try {
    // In a real app, this would include API calls to invalidate tokens, etc.
    await saveAuthState({
      ...defaultState,
      hasCompletedOnboarding: true, // Keep onboarding state
    });
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Logout failed');
  }
};

// Set onboarding complete
export const setOnboardingComplete = async (): Promise<void> => {
  try {
    const currentState = await getAuthState();
    await saveAuthState({
      ...currentState,
      hasCompletedOnboarding: true,
    });
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { isAuthenticated } = await getAuthState();
  return isAuthenticated;
};

// Check if onboarding is complete
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  const { hasCompletedOnboarding } = await getAuthState();
  return hasCompletedOnboarding;
};
