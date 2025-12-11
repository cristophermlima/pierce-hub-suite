-- Remove the overly permissive public SELECT policies
DROP POLICY IF EXISTS "Allow public token validation" ON public.client_form_tokens;
DROP POLICY IF EXISTS "Allow public token validation for forms" ON public.client_form_tokens;

-- Create a security definer function to validate tokens securely
-- This function can be called without authentication but only returns the user_id if valid
CREATE OR REPLACE FUNCTION public.validate_client_form_token(token_value text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  owner_user_id uuid;
BEGIN
  SELECT user_id INTO owner_user_id
  FROM public.client_form_tokens
  WHERE token = token_value
    AND expires_at > now()
    AND used_at IS NULL;
  
  RETURN owner_user_id;
END;
$$;

-- Grant execute permission to anonymous users for the public form
GRANT EXECUTE ON FUNCTION public.validate_client_form_token(text) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_client_form_token(text) TO authenticated;