-- Remove the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Allow token updates to mark as used" ON public.client_form_tokens;

-- Create a security definer function to mark tokens as used securely
CREATE OR REPLACE FUNCTION public.mark_token_as_used(token_value text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.client_form_tokens
  SET used_at = now()
  WHERE token = token_value
    AND expires_at > now()
    AND used_at IS NULL;
  
  RETURN FOUND;
END;
$$;

-- Grant execute permission to anonymous users for the public form
GRANT EXECUTE ON FUNCTION public.mark_token_as_used(text) TO anon;
GRANT EXECUTE ON FUNCTION public.mark_token_as_used(text) TO authenticated;