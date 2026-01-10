-- Tabela para vincular clientes aos planos de fidelidade
CREATE TABLE public.client_loyalty (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.loyalty_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  rewards_claimed INTEGER NOT NULL DEFAULT 0,
  last_reward_at TIMESTAMP WITH TIME ZONE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, plan_id)
);

-- Tabela para histórico de recompensas resgatadas
CREATE TABLE public.loyalty_rewards_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_loyalty_id UUID NOT NULL REFERENCES public.client_loyalty(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL,
  reward_value NUMERIC,
  description TEXT,
  sale_id UUID REFERENCES public.sales(id),
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_loyalty
CREATE POLICY "Users can view their own client loyalty"
  ON public.client_loyalty FOR SELECT
  USING (can_access_owner_data(user_id));

CREATE POLICY "Users can create client loyalty"
  ON public.client_loyalty FOR INSERT
  WITH CHECK (user_id = get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own client loyalty"
  ON public.client_loyalty FOR UPDATE
  USING (can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own client loyalty"
  ON public.client_loyalty FOR DELETE
  USING (can_access_owner_data(user_id));

-- RLS policies for loyalty_rewards_history
CREATE POLICY "Users can view their own rewards history"
  ON public.loyalty_rewards_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM client_loyalty cl
    WHERE cl.id = loyalty_rewards_history.client_loyalty_id
    AND can_access_owner_data(cl.user_id)
  ));

CREATE POLICY "Users can create rewards history"
  ON public.loyalty_rewards_history FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM client_loyalty cl
    WHERE cl.id = loyalty_rewards_history.client_loyalty_id
    AND can_access_owner_data(cl.user_id)
  ));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_client_loyalty_updated_at
  BEFORE UPDATE ON public.client_loyalty
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_client_loyalty_client_id ON public.client_loyalty(client_id);
CREATE INDEX idx_client_loyalty_plan_id ON public.client_loyalty(plan_id);
CREATE INDEX idx_client_loyalty_user_id ON public.client_loyalty(user_id);
CREATE INDEX idx_loyalty_rewards_history_client_loyalty_id ON public.loyalty_rewards_history(client_loyalty_id);