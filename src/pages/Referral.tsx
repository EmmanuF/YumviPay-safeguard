
import React from 'react';
import Header from '@/components/Header';
import { ReferralSection } from '@/components/referral';
import PageTransition from '@/components/PageTransition';

const Referral = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <Header title="Referral Program" showBackButton />
        
        <div className="flex-1 p-4">
          <div className="max-w-md mx-auto">
            <p className="text-gray-600 text-center mb-6">
              Share Yumvi-Pay with your friends and family and earn rewards for each successful referral!
            </p>
            <ReferralSection />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Referral;
