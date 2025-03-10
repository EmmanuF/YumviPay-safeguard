
// Re-export all auth-related functions from their respective modules
export { registerUser } from './register';
export { logoutUser } from './logout';
export { setOnboardingComplete, hasCompletedOnboarding } from './onboarding';
export { getAuthState, isAuthenticated } from './session';
