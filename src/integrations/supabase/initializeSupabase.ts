
import { supabase } from './client';

export const initializeSupabase = async (): Promise<void> => {
  try {
    console.log('Initializing Supabase client...');
    
    // Check connection to Supabase
    const { data, error } = await supabase.from('countries').select('count');
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      throw error;
    } else {
      console.log('Successfully connected to Supabase');
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    // Don't throw here, let the app continue even if Supabase is unreachable
  }
};
