
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { setOnboardingComplete } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useCountries } from '@/hooks/useCountries';

export const useOnboarding = () => {
  const navigate = useNavigate();
  const { countries } = useCountries();
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [sourceCountry, setSourceCountry] = useState({ 
    code: 'US', 
    phoneCode: '+1',
    name: 'United States' 
  });

  useEffect(() => {
    // Check if user is already logged in via Supabase
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Checking auth status:', data.session ? 'Authenticated' : 'Not authenticated');
      
      if (data.session) {
        // If user is already logged in, redirect them to the appropriate page
        await setOnboardingComplete(); // Ensure onboarding is marked as complete
        
        if (pendingTransaction) {
          navigate('/send');
        } else {
          navigate('/dashboard');
        }
      }
    };
    
    checkAuthStatus();
    
    // Get transaction data from localStorage
    const transactionData = localStorage.getItem('pendingTransaction');
    if (transactionData) {
      const parsedData = JSON.parse(transactionData);
      setPendingTransaction(parsedData);
      
      // Find the source country based on the currency
      if (parsedData.sourceCurrency) {
        const sourceCountryData = countries.find(
          country => country.currency === parsedData.sourceCurrency && country.isSendingEnabled
        );
        
        if (sourceCountryData) {
          setSourceCountry({
            code: sourceCountryData.code,
            // Use phonePrefix if available, otherwise default to +1
            phoneCode: sourceCountryData.phonePrefix || '+1',
            name: sourceCountryData.name
          });
        }
      }
    }
  }, [navigate, countries]);

  return {
    pendingTransaction,
    sourceCountry
  };
};
