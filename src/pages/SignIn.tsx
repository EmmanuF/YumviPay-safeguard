
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/auth';
import BiometricLogin from '@/components/auth/BiometricLogin';
import PageTransition from '@/components/PageTransition';
import { BiometricService } from '@/services/biometric';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

// Create SignInForm as a separate component to better manage state
const SignInForm = ({ onSuccess }: { onSuccess: (redirectPath: string) => void }) => {
  const location = useLocation();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.redirectTo || "/dashboard";
  const navigate = useNavigate(); // Added navigate for "Forgot password" link
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await signIn(values.email, values.password);
      
      // Store credentials for biometric login if successful
      try {
        const isAvailable = await BiometricService.isAvailable();
        const isEnabled = await BiometricService.isEnabled();
        
        if (isAvailable && isEnabled) {
          await BiometricService.storeCredentials(values.email, values.password);
        }
      } catch (error) {
        console.log("Failed to store credentials for biometric login:", error);
        // Non-critical error, so we don't need to show it to the user
      }
      
      toast({
        title: "Login successful",
        description: "You have successfully logged in.",
      });
      
      // Navigate to the originally requested page or default to dashboard
      onSuccess(redirectTo);
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate('/forgot-password')}>
            Forgot password?
          </Button>
        </div>
        <Button disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};

const SignIn = () => {
  // Initialize ALL hooks at the top level, before any conditional logic
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isLoggedIn, loading: authLoading, refreshAuthState } = useAuth();
  
  // State variables
  const [showBiometricLogin, setShowBiometricLogin] = useState(false);
  const [redirectRequested, setRedirectRequested] = useState(false);
  const [biometricChecked, setBiometricChecked] = useState(false);
  const redirectTo = location.state?.redirectTo || "/dashboard";

  // Force a refresh of auth state when component mounts
  useEffect(() => {
    const refreshAuth = async () => {
      try {
        await refreshAuthState();
        console.log('Auth state refreshed in SignIn component');
      } catch (error) {
        console.error('Failed to refresh auth state:', error);
      }
    };
    
    refreshAuth();
  }, [refreshAuthState]);

  // Check if user is already logged in
  useEffect(() => {
    if (!authLoading && isLoggedIn && !redirectRequested) {
      console.log('User already logged in, redirecting to:', redirectTo);
      setRedirectRequested(true);
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectTo, redirectRequested, authLoading]);

  // Check biometric availability
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        const biometricAvailable = localStorage.getItem('biometricLoginAvailable') === 'true';
        setShowBiometricLogin(biometricAvailable);
      } catch (error) {
        console.error('Error checking biometric availability:', error);
      } finally {
        setBiometricChecked(true);
      }
    };
    
    checkBiometricAvailability();
  }, []);

  const handleLoginSuccess = (redirectPath: string) => {
    setRedirectRequested(true);
    navigate(redirectPath, { replace: true });
  };

  const handleBiometricSuccess = (credentials: { username: string; password: string }) => {
    const currentRedirectTo = location.state?.redirectTo || "/dashboard";
    const { signIn } = useAuth();
    
    toast({
      title: "Biometric Login",
      description: "Verifying your identity...",
    });
    
    signIn(credentials.username, credentials.password)
      .then(() => {
        toast({
          title: "Biometric Login Successful",
          description: "You have successfully logged in using biometrics.",
        });
        handleLoginSuccess(currentRedirectTo);
      })
      .catch((error) => {
        toast({
          title: "Authentication Failed",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      });
  };

  // Use conditional rendering for UI, not for hooks
  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex-1 flex justify-center items-center">
          <p>Checking authentication status...</p>
        </div>
      );
    }

    if (isLoggedIn && redirectRequested) {
      return (
        <div className="flex-1 flex justify-center items-center">
          <p>Redirecting you...</p>
        </div>
      );
    }

    return (
      <div className="flex-1 p-4 flex flex-col justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SignInForm onSuccess={handleLoginSuccess} />
        </motion.div>
        
        {biometricChecked && showBiometricLogin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BiometricLogin onSuccess={handleBiometricSuccess} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 text-center"
        >
          Don't have an account? <Button variant="link" onClick={() => navigate('/signup')}>Sign Up</Button>
        </motion.div>
      </div>
    );
  };

  // Main return - no early returns for the component
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Sign In" showBackButton={true} />
        {renderContent()}
      </div>
    </PageTransition>
  );
};

export default SignIn;
