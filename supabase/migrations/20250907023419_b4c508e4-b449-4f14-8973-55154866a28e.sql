-- Fix the RLS policy for public client creation via form tokens
-- The issue is that for non-authenticated users, we need a different approach

DROP POLICY IF EXISTS "Allow public client creation via valid form tokens" ON public.clients;

-- Create a more permissive policy that allows public insertion when a valid token exists
CREATE POLICY "Allow public client creation via valid form tokens" 
ON public.clients 
FOR INSERT 
WITH CHECK (
  -- Allow insertion if there's a valid, unused token for this user_id
  EXISTS (
    SELECT 1 
    FROM client_form_tokens cft 
    WHERE cft.user_id = clients.user_id 
      AND cft.expires_at > now() 
      AND cft.used_at IS NULL
  )
);

-- Also need to ensure the anamnesis policy works for public creation
DROP POLICY IF EXISTS "Allow public anamnesis creation via valid form tokens" ON public.anamnesis;

CREATE POLICY "Allow public anamnesis creation via valid form tokens" 
ON public.anamnesis 
FOR INSERT 
WITH CHECK (
  -- Allow anamnesis creation if the client was created via a valid token
  EXISTS (
    SELECT 1 
    FROM clients c
    JOIN client_form_tokens cft ON c.user_id = cft.user_id
    WHERE c.id = anamnesis.client_id 
      AND cft.expires_at > now() 
      AND cft.used_at IS NULL
  )
);