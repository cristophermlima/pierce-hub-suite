-- SOLUÇÃO DEFINITIVA: Limpar todas as políticas conflitantes e criar políticas simples que funcionem

-- 1. Remover TODAS as políticas existentes das tabelas clients e anamnesis
DROP POLICY IF EXISTS "Enable all operations for authenticated users on clients" ON public.clients;
DROP POLICY IF EXISTS "Public client creation with valid tokens" ON public.clients;
DROP POLICY IF EXISTS "Users can create their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;

DROP POLICY IF EXISTS "Enable all operations for authenticated users on anamnesis" ON public.anamnesis;
DROP POLICY IF EXISTS "Public anamnesis creation with valid tokens" ON public.anamnesis;
DROP POLICY IF EXISTS "Users can create their own anamnesis" ON public.anamnesis;
DROP POLICY IF EXISTS "Users can delete their own anamnesis" ON public.anamnesis;
DROP POLICY IF EXISTS "Users can update their own anamnesis" ON public.anamnesis;
DROP POLICY IF EXISTS "Users can view their own anamnesis" ON public.anamnesis;

-- 2. Criar políticas simples e funcionais para clients
CREATE POLICY "clients_insert_policy" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "clients_select_policy" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "clients_update_policy" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "clients_delete_policy" ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- 3. Criar políticas simples e funcionais para anamnesis
CREATE POLICY "anamnesis_insert_policy" ON public.anamnesis FOR INSERT WITH CHECK (true);
CREATE POLICY "anamnesis_select_policy" ON public.anamnesis FOR SELECT 
USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = anamnesis.client_id AND clients.user_id = auth.uid()));
CREATE POLICY "anamnesis_update_policy" ON public.anamnesis FOR UPDATE 
USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = anamnesis.client_id AND clients.user_id = auth.uid()));
CREATE POLICY "anamnesis_delete_policy" ON public.anamnesis FOR DELETE 
USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = anamnesis.client_id AND clients.user_id = auth.uid()));