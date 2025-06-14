
-- Tabela para materiais/insumos usados nos procedimentos
CREATE TABLE public.procedure_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('unit', 'ml', 'gr', 'cm')), -- unidade, mililitro, grama, centímetro
  total_quantity NUMERIC NOT NULL, -- quantidade total do produto
  unit_cost NUMERIC NOT NULL, -- custo por unidade
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para registrar custos de procedimentos por venda
CREATE TABLE public.procedure_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL,
  material_id UUID NOT NULL,
  quantity_used NUMERIC NOT NULL, -- quantidade usada do material
  cost_per_unit NUMERIC NOT NULL, -- custo unitário no momento da venda
  total_cost NUMERIC NOT NULL, -- custo total deste material neste procedimento
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.procedure_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_costs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para procedure_materials
CREATE POLICY "Users can view their own procedure materials" 
  ON public.procedure_materials 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own procedure materials" 
  ON public.procedure_materials 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own procedure materials" 
  ON public.procedure_materials 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own procedure materials" 
  ON public.procedure_materials 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para procedure_costs
CREATE POLICY "Users can view their own procedure costs" 
  ON public.procedure_costs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.sales 
      WHERE sales.id = procedure_costs.sale_id 
      AND sales.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create procedure costs for their own sales" 
  ON public.procedure_costs 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sales 
      WHERE sales.id = procedure_costs.sale_id 
      AND sales.user_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE TRIGGER update_procedure_materials_updated_at
  BEFORE UPDATE ON public.procedure_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar campo de observações para custos de procedimento na tabela sales
ALTER TABLE public.sales ADD COLUMN procedure_notes TEXT;

-- Adicionar campo personalizado para tipo de recompensa nos planos de fidelidade
ALTER TABLE public.loyalty_plans ADD COLUMN custom_reward_type TEXT;
