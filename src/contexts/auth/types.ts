
// Types used across the auth context components
export type AuthContextType = {
  isLoggedIn: boolean;
  user: any | null;
  loading: boolean;
  refreshAuthState: () => Promise<{
    isAuthenticated: boolean;
    user: any | null;
    hasCompletedOnboarding: boolean;
  }>;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
};

export type AuthState = {
  isLoggedIn: boolean;
  user: any | null;
  loading: boolean;
  authError: string | null;
};
