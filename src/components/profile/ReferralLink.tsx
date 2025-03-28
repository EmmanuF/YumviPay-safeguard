
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { navigate } from '@/utils/navigationUtils';

const ReferralLink = () => {
  const reactNavigate = useNavigate();
  
  const handleNavigateToReferral = () => {
    // Use our custom navigation utility for better reliability
    navigate('/referral');
    // As a fallback, also use React Router's navigate
    reactNavigate('/referral');
  };
  
  return (
    <div className="py-3 px-1">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-left font-normal hover:bg-primary-50"
        onClick={handleNavigateToReferral}
      >
        <UserPlus className="h-5 w-5 mr-3 text-primary-600" />
        Invite Friends & Earn
        <span className="ml-auto text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
          Rewards
        </span>
      </Button>
    </div>
  );
};

export default ReferralLink;
