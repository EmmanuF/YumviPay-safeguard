
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const ReferralLink = () => {
  const navigate = useNavigate();
  
  return (
    <div className="py-3 px-1">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-left font-normal hover:bg-primary-50"
        onClick={() => navigate('/referral')}
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
