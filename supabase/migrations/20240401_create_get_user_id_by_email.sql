
-- Create a function that looks up a user ID by email
-- This helps avoid TypeScript type inference issues
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email TEXT)
RETURNS TABLE (user_id UUID) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id as user_id 
  FROM public.profiles 
  WHERE email = user_email
  LIMIT 1;
$$;
