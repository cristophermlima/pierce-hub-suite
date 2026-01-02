-- Team members table for multi-user access
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  member_user_id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'employee',
  permissions jsonb DEFAULT '{"pos": true, "clients": true, "inventory": false, "reports": false, "settings": false, "appointments": true}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for team_members
CREATE POLICY "Owners can manage their team members" 
ON public.team_members 
FOR ALL
USING (auth.uid() = owner_user_id);

CREATE POLICY "Team members can view their own record"
ON public.team_members
FOR SELECT
USING (auth.uid() = member_user_id);

-- Add card_type and receipt_number to sales table
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS card_type text,
ADD COLUMN IF NOT EXISTS card_brand text,
ADD COLUMN IF NOT EXISTS receipt_number text;

-- Terms acceptance table
CREATE TABLE IF NOT EXISTS public.terms_acceptance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  accepted_at timestamp with time zone DEFAULT now(),
  terms_version text NOT NULL DEFAULT '1.0',
  ip_address text
);

ALTER TABLE public.terms_acceptance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own terms acceptance"
ON public.terms_acceptance
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own terms acceptance"
ON public.terms_acceptance
FOR INSERT
WITH CHECK (auth.uid() = user_id);