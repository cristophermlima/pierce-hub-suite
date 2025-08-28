-- Create table for client form tokens
CREATE TABLE public.client_form_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_form_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create tokens for their own clients" 
ON public.client_form_tokens 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM clients 
  WHERE clients.id = client_form_tokens.client_id 
  AND clients.user_id = auth.uid()
));

CREATE POLICY "Users can view tokens for their own clients" 
ON public.client_form_tokens 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM clients 
  WHERE clients.id = client_form_tokens.client_id 
  AND clients.user_id = auth.uid()
));

-- Allow public access to validate tokens (for form submission)
CREATE POLICY "Allow public token validation" 
ON public.client_form_tokens 
FOR SELECT 
USING (expires_at > now() AND used_at IS NULL);