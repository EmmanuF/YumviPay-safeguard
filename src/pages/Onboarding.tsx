
import React from 'react';
import Header from '@/components/Header';
import { OnboardingForm } from '@/components/onboarding';
import { useOnboarding } from '@/hooks/useOnboarding';

const Onboarding: React.FC = () => {
  const { pendingTransaction, sourceCountry } = useOnboarding();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary-50 to-secondary-200">
      <Header 
        transparent={true}
        title="Create Your Account"
      />
      
      <div className="flex-1 flex flex-col px-4 py-6 max-w-md mx-auto w-full">
        <OnboardingForm 
          pendingTransaction={pendingTransaction}
          sourceCountry={sourceCountry}
        />
      </div>
    </div>
  );
};

export default Onboarding;
