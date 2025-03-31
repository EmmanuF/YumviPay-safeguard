
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
import PageTransition from '@/components/PageTransition';

const formSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePassword } = useAuth();
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsResetting(true);
    try {
      await updatePassword(values.password);
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated",
        variant: "success",
      });
      
      navigate('/signin');
    } catch (error: any) {
      toast({
        title: "Failed to Update Password",
        description: error.message || "An error occurred while updating your password",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Reset Password" showBackButton={true} />
        
        <div className="flex-1 p-4 flex flex-col justify-center max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card p-6 rounded-lg shadow-lg border border-border"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">Set Your New Password</h2>
            
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Confirm your password" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button disabled={isResetting} className="w-full" size="lg" type="submit">
                  {isResetting ? "Updating Password..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;
