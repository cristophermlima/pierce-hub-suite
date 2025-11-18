-- Corrigir RLS policies das tabelas clients e anamnesis
-- Remover policies conflitantes que permitem acesso irrestrito

-- Remover policy que permite tudo para clients
DROP POLICY IF EXISTS "Enable all operations for authenticated users on clients" ON public.clients;

-- Remover policy que permite inserção sem user_id para clients  
DROP POLICY IF EXISTS "clients_insert_policy" ON public.clients;

-- Criar nova policy de inserção que requer user_id
CREATE POLICY "clients_insert_policy" ON public.clients
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Remover policy que permite inserção sem verificação para anamnesis
DROP POLICY IF EXISTS "anamnesis_insert_policy" ON public.anamnesis;

-- Criar nova policy de inserção que verifica o cliente pertence ao usuário
CREATE POLICY "anamnesis_insert_policy" ON public.anamnesis
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = anamnesis.client_id
    AND clients.user_id = auth.uid()
  )
);