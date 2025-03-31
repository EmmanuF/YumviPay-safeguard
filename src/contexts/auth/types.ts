
export interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  loading: boolean;
  authError: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshAuthState: () => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}
