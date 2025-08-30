-- Enable RLS and create policies for aftercare_schedules
ALTER TABLE public.aftercare_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own aftercare schedules" 
ON public.aftercare_schedules 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own aftercare schedules" 
ON public.aftercare_schedules 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own aftercare schedules" 
ON public.aftercare_schedules 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own aftercare schedules" 
ON public.aftercare_schedules 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS and create policies for material_usage
ALTER TABLE public.material_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own material usage" 
ON public.material_usage 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM sterilized_materials 
  WHERE sterilized_materials.id = material_usage.material_id 
  AND sterilized_materials.user_id = auth.uid()
));

CREATE POLICY "Users can create material usage for their own materials" 
ON public.material_usage 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM sterilized_materials 
  WHERE sterilized_materials.id = material_usage.material_id 
  AND sterilized_materials.user_id = auth.uid()
));

-- Enable RLS and create policies for aftercare_templates
ALTER TABLE public.aftercare_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own aftercare templates" 
ON public.aftercare_templates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own aftercare templates" 
ON public.aftercare_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own aftercare templates" 
ON public.aftercare_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own aftercare templates" 
ON public.aftercare_templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS and create policies for sterilized_materials
ALTER TABLE public.sterilized_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sterilized materials" 
ON public.sterilized_materials 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sterilized materials" 
ON public.sterilized_materials 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sterilized materials" 
ON public.sterilized_materials 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sterilized materials" 
ON public.sterilized_materials 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix database function security by adding proper search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.schedule_aftercare_message()
RETURNS TRIGGER AS $$
DECLARE
  active_template aftercare_templates%ROWTYPE;
BEGIN
  -- Buscar template ativo para cuidados pós-procedimento
  SELECT * INTO active_template
  FROM aftercare_templates
  WHERE user_id = NEW.user_id 
    AND is_active = true
  LIMIT 1;
  
  -- Se encontrou um template ativo, agendar envio para 2 horas após a venda
  IF active_template.id IS NOT NULL THEN
    INSERT INTO aftercare_schedules (
      user_id,
      sale_id,
      client_id,
      template_id,
      scheduled_at
    ) VALUES (
      NEW.user_id,
      NEW.id,
      NEW.client_id,
      active_template.id,
      NEW.created_at + INTERVAL '2 hours'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Reduzir o estoque apenas para produtos que não são serviços
  UPDATE public.inventory
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id AND is_service = false;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;