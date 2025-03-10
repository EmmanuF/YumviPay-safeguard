
import { supabase } from '@/integrations/supabase/client';

// Get user ID from current session
export const getUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
};
