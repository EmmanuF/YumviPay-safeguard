
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Shield } from 'lucide-react';
import { registerUser, setOnboardingComplete } from '@/services/auth';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.email.trim() !== '' && 
           /^\S+@\S+\.\S+$/.test(formData.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Please check your information",
        description: "Make sure you've entered your name and a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Register with minimal info, country defaults to "US" and phone to empty for now
      await registerUser(
        formData.name,
        formData.email,
        "", // Phone will be collected by Kado KYC
        "US" // Default country, will be updated during KYC
      );
      
      await setOnboardingComplete();
      
      toast({
        title: "Welcome to Yumvi-Pay!",
        description: "Your account has been created successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Account creation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white">
      <Header 
        transparent={true}
        title="Create Your Account"
      />
      
      <div className="flex-1 flex flex-col px-4 py-6 max-w-md mx-auto w-full">
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Get started with Yumvi-Pay</h2>
          
          <div className="space-y-6 mb-8">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="glass-effect w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="glass-effect w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
              />
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-4 flex items-start mb-8">
            <Shield className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              We only collect essential information now. Additional details for compliance will be collected securely by our KYC provider.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid()}
            className={`w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 rounded-xl 
                      transition-all duration-300 flex items-center justify-center
                      ${(isSubmitting || !isFormValid()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Onboarding;
