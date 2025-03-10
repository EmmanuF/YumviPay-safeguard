
import { initializeTransactions } from '@/services/transaction';
import { initializeCountries } from './initializeCountries';
import { supabase } from '@/integrations/supabase/client';

export const initializeApp = async (): Promise<void> => {
  // Check if user is authenticated
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = !!data.session;
  
  // Always initialize transactions for the app to function properly
  await initializeTransactions();
  
  // Only initialize countries if user is authenticated
  // This prevents unauthorized access attempts to the database
  if (isAuthenticated) {
    await initializeCountries();
  }
};
