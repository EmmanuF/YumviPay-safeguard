
import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  disabled?: boolean;
  isComingSoon?: boolean;
  countryCode?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ 
  to, 
  children, 
  disabled = false,
  isComingSoon = false,
  countryCode
}) => {
  const { toast } = useToast();

  const handleComingSoonClick = (e: React.MouseEvent) => {
    if (isComingSoon) {
      e.preventDefault();
      toast({
        title: "Coming Soon",
        description: `Money transfers to ${children} will be available soon!`,
        duration: 3000,
      });
    }
  };

  // Handle special case for Cameroon
  const handleClick = (e: React.MouseEvent) => {
    if (isComingSoon) {
      handleComingSoonClick(e);
    } else if (countryCode === 'CM') {
      // For Cameroon, store initial transaction data
      const transactionData = {
        targetCountry: 'CM',
        amount: 100, // Default amount
        sourceCurrency: 'USD',
        targetCurrency: 'XAF',
        exchangeRate: 607.4330,
      };
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
    }
  };
  
  if (disabled) {
    return (
      <span className="text-gray-400 cursor-not-allowed text-sm block mb-3">
        {children}
      </span>
    );
  }
  
  return (
    <Link 
      to={to}
      className="text-gray-300 hover:text-white transition-colors text-sm block mb-3 relative group"
      onClick={handleClick}
    >
      <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
        {children}
      </span>
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary-300 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
};

export default FooterLink;
