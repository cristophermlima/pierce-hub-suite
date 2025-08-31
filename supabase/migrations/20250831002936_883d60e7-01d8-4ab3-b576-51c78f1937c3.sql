-- Create policy to allow public client creation via valid form tokens
CREATE POLICY "Allow public client creation via valid form tokens" 
ON public.clients 
FOR INSERT 
WITH CHECK (
  -- Allow if there's a valid, unused token that matches the user_id being inserted
  EXISTS (
    SELECT 1 
    FROM public.client_form_tokens 
    WHERE user_id = clients.user_id 
      AND expires_at > now() 
      AND used_at IS NULL
  )
);