
import React, { useState } from 'react';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { requestPasswordReset } from '@/services/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await requestPasswordReset(values.email);
      
      if (error) {
        throw error;
      }
      
      setSubmitted(true);
      toast({
        title: "Request sent",
        description: "If an account exists with that email, you'll receive password reset instructions.",
      });
    } catch (error: any) {
      console.error('Password reset request error:', error);
      
      // We don't want to reveal if an email exists or not for security reasons
      // So we show a success message regardless of the actual result
      setSubmitted(true);
      toast({
        title: "Request sent",
        description: "If an account exists with that email, you'll receive password reset instructions.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Always render the form content, but conditionally show different views
  // This ensures consistent hook execution order
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Forgot Password" showBackButton={true} />
        
        <div className="flex-1 p-4 flex flex-col justify-center max-w-md mx-auto w-full">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 p-4"
            >
              <div className="mx-auto bg-primary/10 p-6 rounded-full w-20 h-20 flex items-center justify-center">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Check Your Email</h2>
              <p className="text-muted-foreground">
                We've sent password reset instructions to your email address. 
                Check your inbox and follow the link to reset your password.
              </p>
              <Alert>
                <AlertDescription>
                  If you don't receive the email within a few minutes, check your spam folder.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => navigate('/signin')} 
                className="mt-6"
                variant="outline"
              >
                Return to Sign In
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Reset Your Password</h2>
                <p className="text-muted-foreground mt-2">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email address" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button disabled={isSubmitting} type="submit" className="w-full" size="lg">
                    {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/signin')}
                      type="button"
                      className="mt-2"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
