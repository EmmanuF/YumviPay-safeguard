import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { registerUser, setOnboardingComplete } from '@/services/auth';
import TransactionPreview from './TransactionPreview';
import SecurityNote from './SecurityNote';

interface OnboardingFormProps {
  pendingTransaction: any;
  sourceCountry: {
    code: string;
    phoneCode: string;
    name: string;
  };
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ 
  pendingTransaction, 
  sourceCountry 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.email.trim() !== '' && 
           /^\S+@\S+\.\S+$/.test(formData.email) &&
           formData.phone.trim() !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Please check your information",
        description: "Make sure you've entered your name, a valid email address, and phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process...');
      const user = await registerUser(
        formData.name,
        formData.email,
        formData.phone,
        sourceCountry.code
      );
      
      console.log('Registration successful:', user);
      await setOnboardingComplete();
      
      toast({
        title: "Welcome to Yumvi-Pay!",
        description: "Your account has been created successfully.",
      });
      
      // Add a slight delay before redirecting to ensure state is updated
      setTimeout(() => {
        if (pendingTransaction) {
          navigate('/send');
        } else {
          navigate('/dashboard');
        }
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Account creation failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Get started with Yumvi-Pay</h2>
      
      {pendingTransaction && (
        <TransactionPreview transaction={pendingTransaction} />
      )}
      
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
        
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={`${sourceCountry.phoneCode}xxxxxxxxx`}
              className="glass-effect w-full pl-10 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Format: Include country code (e.g., {sourceCountry.phoneCode} for {sourceCountry.name})
          </p>
        </div>
      </div>
      
      <SecurityNote />
      
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
  );
};

export default OnboardingForm;
