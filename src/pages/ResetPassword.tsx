
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LockKeyhole, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { updatePassword } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasResetSession, setHasResetSession] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Check if the user has a valid password reset session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        setHasResetSession(true);
      } else {
        // No valid session, redirect to forgot password
        toast({
          title: "Invalid or expired reset link",
          description: "Please request a new password reset link.",
          variant: "destructive",
        });
        navigate('/forgot-password');
      }
    };

    checkSession();
  }, [navigate, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await updatePassword(values.password);
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
        variant: "success",
      });
      
      // Wait a bit before redirecting to sign in
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
      
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        title: "Password update failed",
        description: error.message || "Unable to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasResetSession) {
    return <div className="p-8 text-center">Verifying your reset link...</div>;
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Reset Password" showBackButton={false} />
        
        <div className="flex-1 p-4 flex flex-col justify-center max-w-md mx-auto w-full">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 p-4"
            >
              <div className="mx-auto bg-green-100 p-6 rounded-full w-20 h-20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold">Password Updated!</h2>
              <p className="text-muted-foreground">
                Your password has been successfully updated. You'll be redirected to the sign in page.
              </p>
              <Button 
                onClick={() => navigate('/signin')} 
                className="mt-6"
              >
                Sign In Now
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <LockKeyhole className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Create New Password</h2>
                <p className="text-muted-foreground mt-2">
                  Your new password must be different from previously used passwords.
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter new password" {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters with one uppercase letter and one number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm new password" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button disabled={isSubmitting} type="submit" className="w-full" size="lg">
                    {isSubmitting ? "Updating..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;
