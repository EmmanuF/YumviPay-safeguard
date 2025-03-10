
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { BiometricLogin } from '@/components/auth';
import { BiometricService } from '@/services/biometric';
import { enableMockAuth } from '@/services/auth';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const isDev = import.meta.env.DEV;

  // Check if we're already signed in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Store credentials for biometric login if remember me is checked
      if (rememberMe) {
        const biometricEnabled = await BiometricService.isEnabled();
        if (biometricEnabled) {
          await BiometricService.storeCredentials(email, password);
          toast({
            title: "Biometric login enabled",
            description: "You can now sign in with biometrics next time.",
          });
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enableDevMode = async () => {
    try {
      await enableMockAuth();
      toast({
        title: "Development mode enabled",
        description: "You are now signed in as a demo user.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error enabling development mode:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white">
      <Header title="Sign In" />
      
      <div className="flex-1 flex flex-col px-4 py-6 max-w-md mx-auto w-full">
        <BiometricLogin />
        
        <form onSubmit={handleSignIn} className="flex flex-col space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me for biometric login
            </label>
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          {isDev && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={enableDevMode}
              className="mt-2"
            >
              Development Mode
            </Button>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
