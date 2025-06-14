
-- Tabela para tipos de rosca
CREATE TABLE public.thread_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir tipos de rosca padrão
INSERT INTO public.thread_specifications (name, description) VALUES
('Interna', 'Rosca interna'),
('Externa', 'Rosca externa'),
('Push Pin', 'Sistema push pin (encaixe por pressão)');

-- Tabela para tipos de fechamento de argolas
CREATE TABLE public.ring_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir tipos de fechamento padrão
INSERT INTO public.ring_closures (name, description) VALUES
('Clicker', 'Fechamento clicker'),
('Segmento', 'Fechamento segmento removível'),
('Torção', 'Fechamento por torção'),
('Captive', 'Fechamento captive bead');

-- Adicionar novos campos à tabela inventory
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS thread_specification_id UUID REFERENCES public.thread_specifications(id);
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS ring_closure_id UUID REFERENCES public.ring_closures(id);
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS size_mm NUMERIC;

-- RLS para as novas tabelas (públicas para todos os usuários)
ALTER TABLE public.thread_specifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to thread specifications" ON public.thread_specifications FOR SELECT USING (true);

ALTER TABLE public.ring_closures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to ring closures" ON public.ring_closures FOR SELECT USING (true);
