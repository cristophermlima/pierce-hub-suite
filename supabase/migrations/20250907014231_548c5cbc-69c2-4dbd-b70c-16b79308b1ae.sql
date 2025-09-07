-- Drop existing conflicting policy and create the correct one
DROP POLICY IF EXISTS "Allow public client creation via valid form tokens" ON public.clients;

-- Create proper policy for public client creation via form tokens
CREATE POLICY "Allow public client creation via valid form tokens" 
ON public.clients 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM client_form_tokens cft 
    WHERE cft.user_id = clients.user_id 
      AND cft.expires_at > now() 
      AND cft.used_at IS NULL
  )
);