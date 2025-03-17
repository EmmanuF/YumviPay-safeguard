
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation, Features, Hero, AppDownload } from '@/components/home';
import { useAuth } from '@/contexts/AuthContext';
import { hasCompletedOnboarding } from '@/services/auth';

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isLoggedIn) {
        // If user is logged in, redirect to dashboard
        navigate('/dashboard');
        return;
      }
      
      // Check if onboarding was completed previously
      const onboardingCompleted = await hasCompletedOnboarding();
      
      if (onboardingCompleted) {
        // If onboarding was completed but not logged in, direct to sign in
        navigate('/signin');
      }
      
      setCheckingOnboarding(false);
    };
    
    if (!loading) {
      checkOnboardingStatus();
    }
  }, [isLoggedIn, loading, navigate]);
  
  const handleGetStarted = () => {
    navigate('/onboarding');
  };
  
  // Show loading state if we're checking auth or onboarding status
  if (loading || checkingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation onGetStarted={handleGetStarted} />
      
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <AppDownload />
      </main>
      
      <footer className="py-6 px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Yumvi-Pay. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
