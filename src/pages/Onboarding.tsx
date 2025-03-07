
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import CountrySelector from '@/components/CountrySelector';
import { ArrowRight, Shield, Check, Smartphone } from 'lucide-react';
import { registerUser, setOnboardingComplete } from '@/services/auth';

interface OnboardingFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.email.trim() !== '' && formData.phone.trim() !== '';
      case 3:
        return formData.country !== '';
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (!isStepValid()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      await registerUser(
        formData.name,
        formData.email,
        formData.phone,
        formData.country
      );
      
      await setOnboardingComplete();
      
      toast({
        title: "Registration successful!",
        description: "Welcome to Yumvi-Pay.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white">
      <Header 
        showBackButton={step > 1}
        transparent
        title={step === 1 ? "Create Account" : step === 2 ? "Contact Information" : "Select Country"}
      />
      
      <div className="flex-1 flex flex-col px-4 py-2 max-w-md mx-auto w-full">
        {/* Progress steps */}
        <div className="flex justify-between mb-8 px-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                          ${step === stepNumber 
                              ? 'bg-primary-500 text-white' 
                              : step > stepNumber 
                                ? 'bg-primary-100 text-primary-500' 
                                : 'bg-gray-100 text-gray-400'}`}
              >
                {step > stepNumber ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
              <div className={`h-1 ${step >= stepNumber ? 'bg-primary-300' : 'bg-gray-200'} 
                             ${stepNumber === 1 ? 'w-full ml-full' : stepNumber === 3 ? 'w-full mr-full' : 'w-full'}`}>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex-1">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">What's your name?</h2>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="glass-effect w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                />
              </div>
              
              <div className="glass-effect rounded-xl p-4 flex items-start mb-4">
                <Shield className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Your information is secure and will only be used for transaction purposes.
                </p>
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">How can we reach you?</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="glass-effect w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                />
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="glass-effect w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                />
              </div>
              
              <div className="glass-effect rounded-xl p-4 flex items-start mb-4">
                <Smartphone className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  We'll use this to send you transaction updates and receipts.
                </p>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Where are you sending from?</h2>
              
              <CountrySelector
                label="Your Country"
                value={formData.country}
                onChange={handleCountryChange}
                type="send"
              />
              
              <div className="glass-effect rounded-xl p-4 flex items-start mb-4">
                <Shield className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  We'll show you the most relevant payment methods based on your location.
                </p>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="w-full mb-6">
          <button
            onClick={goToNextStep}
            disabled={!isStepValid()}
            className={`w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 rounded-xl 
                        transition-all duration-300 flex items-center justify-center
                        ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {step < 3 ? 'Continue' : 'Complete Setup'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
