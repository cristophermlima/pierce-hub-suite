
-- Criar tabela para templates de cuidados pós-procedimento
CREATE TABLE aftercare_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para agendamento de mensagens de cuidados
CREATE TABLE aftercare_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sale_id UUID NOT NULL,
  client_id UUID,
  template_id UUID NOT NULL REFERENCES aftercare_templates(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para materiais esterilizados
CREATE TABLE sterilized_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'kit' CHECK (category IN ('kit', 'tool', 'other')),
  quantity_sterile INTEGER NOT NULL DEFAULT 0,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  sterilization_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  sterilization_method TEXT NOT NULL,
  batch_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para registro de uso de materiais
CREATE TABLE material_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES sterilized_materials(id) ON DELETE CASCADE,
  quantity_used INTEGER NOT NULL,
  used_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sale_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_aftercare_templates_user_id ON aftercare_templates(user_id);
CREATE INDEX idx_aftercare_schedules_user_id ON aftercare_schedules(user_id);
CREATE INDEX idx_aftercare_schedules_status ON aftercare_schedules(status);
CREATE INDEX idx_aftercare_schedules_scheduled_at ON aftercare_schedules(scheduled_at);
CREATE INDEX idx_sterilized_materials_user_id ON sterilized_materials(user_id);
CREATE INDEX idx_sterilized_materials_expiration ON sterilized_materials(expiration_date);
CREATE INDEX idx_material_usage_material_id ON material_usage(material_id);

-- Adicionar triggers para updated_at
DROP TRIGGER IF EXISTS update_aftercare_templates_updated_at ON aftercare_templates;
CREATE TRIGGER update_aftercare_templates_updated_at
  BEFORE UPDATE ON aftercare_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sterilized_materials_updated_at ON sterilized_materials;
CREATE TRIGGER update_sterilized_materials_updated_at
  BEFORE UPDATE ON sterilized_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Criar função para agendar mensagens de cuidados pós-procedimento
CREATE OR REPLACE FUNCTION schedule_aftercare_message()
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
$$ LANGUAGE plpgsql;

-- Criar trigger para agendar mensagens automaticamente após vendas
DROP TRIGGER IF EXISTS trigger_schedule_aftercare ON sales;
CREATE TRIGGER trigger_schedule_aftercare
  AFTER INSERT ON sales
  FOR EACH ROW
  WHEN (NEW.client_id IS NOT NULL)
  EXECUTE FUNCTION schedule_aftercare_message();
