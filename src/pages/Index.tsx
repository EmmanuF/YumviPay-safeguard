
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasCompletedOnboarding, isAuthenticated } from '@/services/auth';
import { useCountries } from '@/hooks/useCountries';
import Navigation from '@/components/home/Navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import AppDownload from '@/components/home/AppDownload';

const Index = () => {
  const navigate = useNavigate();
  const { countries } = useCountries();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = await isAuthenticated();
      const onboardingCompleted = await hasCompletedOnboarding();
      
      if (authenticated) {
        navigate('/dashboard');
      } else if (onboardingCompleted) {
        // User has completed onboarding but is not logged in
        // Could show login page here
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation header */}
      <Navigation />
      
      <main className="flex-1 bg-gradient-to-b from-primary-50 to-white">
        {/* Hero section with calculator */}
        <Hero />
        
        {/* Features section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Features />
          
          {/* QR code section */}
          <AppDownload />
        </div>
      </main>
    </div>
  );
};

export default Index;
