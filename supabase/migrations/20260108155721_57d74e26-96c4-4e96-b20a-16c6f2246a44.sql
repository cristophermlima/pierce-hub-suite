-- Criar função RPC para obter o effective_user_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_my_effective_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT owner_user_id FROM team_members WHERE member_user_id = auth.uid() AND is_active = true LIMIT 1),
    auth.uid()
  );
$$;