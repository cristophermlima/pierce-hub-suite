-- Criar tabela para catálogos de joias
CREATE TABLE public.catalogs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  share_token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela para itens do catálogo
CREATE TABLE public.catalog_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog_id uuid NOT NULL REFERENCES public.catalogs(id) ON DELETE CASCADE,
  inventory_id uuid NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  custom_name text,
  custom_price numeric,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela para fotos de clientes
CREATE TABLE public.client_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  description text,
  photo_type text DEFAULT 'portfolio',
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_photos ENABLE ROW LEVEL SECURITY;

-- Políticas para catalogs
CREATE POLICY "Users can create their own catalogs" ON public.catalogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own catalogs" ON public.catalogs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own catalogs" ON public.catalogs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catalogs" ON public.catalogs
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view active catalogs by token" ON public.catalogs
  FOR SELECT USING (is_active = true);

-- Políticas para catalog_items
CREATE POLICY "Users can manage items in their catalogs" ON public.catalog_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.catalogs
      WHERE catalogs.id = catalog_items.catalog_id
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view items of active catalogs" ON public.catalog_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.catalogs
      WHERE catalogs.id = catalog_items.catalog_id
      AND catalogs.is_active = true
    )
  );

-- Políticas para client_photos
CREATE POLICY "Users can manage photos of their clients" ON public.client_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_photos.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE TRIGGER update_catalogs_updated_at
  BEFORE UPDATE ON public.catalogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket para fotos de clientes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-photos', 'client-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage para client-photos
CREATE POLICY "Anyone can view client photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'client-photos');

CREATE POLICY "Authenticated users can upload client photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'client-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own client photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'client-photos' AND auth.role() = 'authenticated');

-- Criar bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para profile-photos
CREATE POLICY "Anyone can view profile photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload profile photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-photos' AND auth.role() = 'authenticated');