
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
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import BiometricLogin from '@/components/auth/BiometricLogin';
import PageTransition from '@/components/PageTransition';
import { BiometricService } from '@/services/biometric';
import { AlertCircle, WifiOff, CloudOff } from 'lucide-react';
import { useNetwork } from '@/contexts/network';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { isOnline } = useNetwork();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBiometricLogin, setShowBiometricLogin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [supabaseAvailable, setSupabaseAvailable] = useState<boolean | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isAvailable = await checkSupabaseConnection();
        setSupabaseAvailable(isAvailable);
        if (!isAvailable && isOnline) {
          setAuthError("Unable to connect to authentication service. You may need to check your API configuration.");
        }
      } catch (error) {
        console.error("Error checking Supabase connection:", error);
        setSupabaseAvailable(false);
      }
    };
    
    if (isOnline) {
      checkConnection();
    }
  }, [isOnline]);
  
  useEffect(() => {
    // Check if biometric login is available
    const checkBiometricAvailability = async () => {
      try {
        const biometricAvailable = localStorage.getItem('biometricLoginAvailable') === 'true';
        setShowBiometricLogin(biometricAvailable);
      } catch (error) {
        console.error("Error checking biometric availability:", error);
        setShowBiometricLogin(false);
      }
    };
    
    checkBiometricAvailability();
    
    // Clear any previous errors when component mounts
    setAuthError(null);
  }, []);

  // Reset auth error if network status changes
  useEffect(() => {
    if (isOnline) {
      // Don't clear the error if it's a configuration issue
      if (authError && !authError.includes("API configuration")) {
        setAuthError(null);
      }
      
      // Check Supabase connection again when coming back online
      checkSupabaseConnection().then(isAvailable => {
        setSupabaseAvailable(isAvailable);
        if (!isAvailable) {
          setAuthError("Unable to connect to authentication service. You may need to check your API configuration.");
        }
      });
    } else {
      setAuthError("You appear to be offline. Please check your internet connection and try again.");
    }
  }, [isOnline, authError]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    if (!isOnline) {
      setAuthError("You appear to be offline. Please check your internet connection and try again.");
      setIsSubmitting(false);
      return;
    }
    
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
      
      toast.success("Login successful", {
        description: "You have successfully logged in."
      });
      
      const redirectTo = location.state?.redirectTo || "/";
      navigate(redirectTo);
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Set appropriate error message based on error type
      if (!navigator.onLine || error.message?.includes('Failed to fetch') || error.type === 'connection-error') {
        setAuthError("Unable to reach authentication servers. Please check your internet connection and try again.");
      } else if (error.type === 'timeout-error') {
        setAuthError("Connection timed out. Please try again later.");
      } else {
        setAuthError(error.message || "Invalid credentials. Please try again.");
      }
      
      toast.error("Authentication Failed", {
        description: error.message || "Invalid credentials. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricSuccess = (credentials: { username: string; password: string }) => {
    // Use the retrieved credentials to sign in
    setIsSubmitting(true);
    signIn(credentials.username, credentials.password)
      .then(() => {
        toast.success("Biometric Login Successful", {
          description: "You have successfully logged in using biometrics."
        });
        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo);
      })
      .catch((error) => {
        console.error("Biometric auth error:", error);
        setAuthError(
          !navigator.onLine 
            ? "Unable to reach authentication servers. Please check your internet connection."
            : (error.message || "Authentication failed. Please try using password login.")
        );
        
        toast.error("Authentication Failed", {
          description: error.message || "Authentication failed. Please try using password login."
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const getErrorIcon = () => {
    if (!isOnline) return <WifiOff className="h-5 w-5 mr-2 flex-shrink-0" />;
    if (supabaseAvailable === false) return <CloudOff className="h-5 w-5 mr-2 flex-shrink-0" />;
    return <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />;
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Sign In" showBackButton={true} />
        
        <div className="flex-1 p-4 flex flex-col justify-center max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {!isOnline && (
              <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 flex items-center">
                <WifiOff className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>You appear to be offline. Sign in requires an internet connection.</span>
              </div>
            )}
            
            {authError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 flex items-center">
                {getErrorIcon()}
                <span>{authError}</span>
              </div>
            )}
            
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
                <Button 
                  disabled={isSubmitting || (!isOnline && !form.formState.isValid)} 
                  className="w-full btn-primary-visible" 
                  size="lg"
                  type="submit"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </motion.div>
          
          {showBiometricLogin && (
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
      </div>
    </PageTransition>
  );
};

export default SignIn;
