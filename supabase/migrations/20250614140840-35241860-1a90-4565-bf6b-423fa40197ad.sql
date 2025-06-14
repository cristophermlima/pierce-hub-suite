
-- Criar tabela para gerenciar assinaturas dos usuários
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_type text NOT NULL DEFAULT 'trial', -- 'trial', 'premium', 'expired'
  trial_start_date timestamptz,
  trial_end_date timestamptz,
  subscription_start_date timestamptz,
  subscription_end_date timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Ativar RLS na tabela
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias assinaturas
CREATE POLICY "Users can view own subscription"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Política para inserção (apenas para edge functions)
CREATE POLICY "Service role can insert subscriptions"
ON public.user_subscriptions
FOR INSERT
WITH CHECK (true);

-- Política para atualização (apenas para edge functions)
CREATE POLICY "Service role can update subscriptions"
ON public.user_subscriptions
FOR UPDATE
USING (true);

-- Função para criar automaticamente um período de teste para novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user_trial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_type,
    trial_start_date,
    trial_end_date
  )
  VALUES (
    NEW.id,
    'trial',
    now(),
    now() + interval '10 days'
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar automaticamente o período de teste
CREATE TRIGGER on_auth_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_trial();

-- Função para verificar se o usuário tem acesso ativo
CREATE OR REPLACE FUNCTION public.user_has_active_access(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT CASE 
    WHEN subscription_type = 'trial' AND trial_end_date > now() THEN true
    WHEN subscription_type = 'premium' AND subscription_end_date > now() THEN true
    ELSE false
  END
  FROM public.user_subscriptions
  WHERE user_id = user_uuid;
$$;
