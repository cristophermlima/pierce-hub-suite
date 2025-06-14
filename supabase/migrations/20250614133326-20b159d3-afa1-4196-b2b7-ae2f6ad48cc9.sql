
-- Tabela de planos/campanhas de fidelidade personalizáveis por usuário
CREATE TABLE public.loyalty_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  conditions JSONB, -- Ex: [{"field":"visits", "operator":">=", "value":5}]
  reward JSONB,     -- Ex: [{"type":"discount", "value":15, "unit":"%"}]
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de campos customizados definidos por cada usuário para o estoque
CREATE TABLE public.inventory_custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id),
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text', -- text/number/date/select/etc
  options JSONB DEFAULT NULL, -- Para campos select/lista ex: ["azul", "vermelho"]
  required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela para os valores dos campos customizados preenchidos em cada item do estoque
CREATE TABLE public.inventory_item_custom_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory (id),
  custom_field_id UUID NOT NULL REFERENCES inventory_custom_fields (id),
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Apenas cada usuário pode ver/criar/editar seus planos e campos
ALTER TABLE public.loyalty_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can manage their own loyalty plans"
  ON public.loyalty_plans
  FOR ALL
  USING (user_id = auth.uid());

ALTER TABLE public.inventory_custom_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can manage their own inventory custom fields"
  ON public.inventory_custom_fields
  FOR ALL
  USING (user_id = auth.uid());

ALTER TABLE public.inventory_item_custom_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can access custom inventory field values for their items"
  ON public.inventory_item_custom_values
  FOR ALL
  USING (
    item_id IN (
      SELECT id FROM inventory WHERE user_id = auth.uid()
    )
  );
