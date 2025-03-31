
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, isLoggedIn, resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBiometricLogin, setShowBiometricLogin] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Get the page they were trying to access
  const redirectTo = location.state?.redirectTo || "/dashboard";

  // Check if user is already logged in, redirect if they are
  useEffect(() => {
    if (isLoggedIn) {
      console.log('User already logged in, redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectTo]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    // Check if biometric login is available (e.g., via local storage)
    const biometricAvailable = localStorage.getItem('biometricLoginAvailable') === 'true';
    setShowBiometricLogin(biometricAvailable);
  }, []);

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
      navigate(redirectTo, { replace: true });
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

  const handleBiometricSuccess = (credentials: { username: string; password: string }) => {
    // Use the retrieved credentials to sign in
    setIsSubmitting(true);
    signIn(credentials.username, credentials.password)
      .then(() => {
        toast({
          title: "Biometric Login Successful",
          description: "You have successfully logged in using biometrics.",
        });
        navigate(redirectTo, { replace: true });
      })
      .catch((error) => {
        toast({
          title: "Authentication Failed",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsResettingPassword(true);
    try {
      await resetPassword(values.email);
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password.",
        variant: "success",
      });
      
      setShowResetPasswordDialog(false);
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message || "Unable to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
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
                <Button disabled={isSubmitting} className="w-full" size="lg">
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
            className="mt-4 text-center space-y-2"
          >
            <div>
              <Button variant="link" onClick={() => setShowResetPasswordDialog(true)}>
                Forgot Password?
              </Button>
            </div>
            <div>
              Don't have an account? <Button variant="link" onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>

          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
              <FormField
                control={resetPasswordForm.control}
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
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowResetPasswordDialog(false)}
                  disabled={isResettingPassword}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? "Sending..." : "Send Reset Link"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default SignIn;
