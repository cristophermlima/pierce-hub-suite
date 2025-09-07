-- Allow public anamnesis creation via valid form tokens
CREATE POLICY "Allow public anamnesis creation via valid form tokens" 
ON public.anamnesis 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM clients c 
    JOIN client_form_tokens cft ON c.user_id = cft.user_id 
    WHERE c.id = anamnesis.client_id 
      AND cft.expires_at > now() 
      AND cft.used_at IS NULL
  )
);