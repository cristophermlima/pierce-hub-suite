-- Função que retorna o owner_user_id para membros de equipe, ou o próprio user_id se for dono
CREATE OR REPLACE FUNCTION public.get_effective_user_id(p_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT owner_user_id FROM team_members WHERE member_user_id = p_user_id AND is_active = true LIMIT 1),
    p_user_id
  );
$$;

-- Função auxiliar para verificar se usuário pode acessar dados de um owner
CREATE OR REPLACE FUNCTION public.can_access_owner_data(data_owner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    auth.uid() = data_owner_id 
    OR EXISTS (
      SELECT 1 FROM team_members 
      WHERE member_user_id = auth.uid() 
      AND owner_user_id = data_owner_id 
      AND is_active = true
    );
$$;

-- Atualizar políticas da tabela clients
DROP POLICY IF EXISTS "clients_select_policy" ON clients;
DROP POLICY IF EXISTS "clients_insert_policy" ON clients;
DROP POLICY IF EXISTS "clients_update_policy" ON clients;
DROP POLICY IF EXISTS "clients_delete_policy" ON clients;

CREATE POLICY "clients_select_policy" ON clients FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "clients_insert_policy" ON clients FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "clients_update_policy" ON clients FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "clients_delete_policy" ON clients FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela inventory
DROP POLICY IF EXISTS "Users can view their own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can create their own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can update their own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can delete their own inventory" ON inventory;

CREATE POLICY "Users can view their own inventory" ON inventory FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own inventory" ON inventory FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own inventory" ON inventory FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own inventory" ON inventory FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela sales
DROP POLICY IF EXISTS "Users can view their own sales" ON sales;
DROP POLICY IF EXISTS "Users can create their own sales" ON sales;
DROP POLICY IF EXISTS "Users can update their own sales" ON sales;
DROP POLICY IF EXISTS "Users can delete their own sales" ON sales;

CREATE POLICY "Users can view their own sales" ON sales FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own sales" ON sales FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own sales" ON sales FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own sales" ON sales FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela appointments
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON appointments;

CREATE POLICY "Users can view their own appointments" ON appointments FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own appointments" ON appointments FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own appointments" ON appointments FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own appointments" ON appointments FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela cash_registers
DROP POLICY IF EXISTS "Users can view their own cash registers" ON cash_registers;
DROP POLICY IF EXISTS "Users can create their own cash registers" ON cash_registers;
DROP POLICY IF EXISTS "Users can update their own cash registers" ON cash_registers;
DROP POLICY IF EXISTS "Users can delete their own cash registers" ON cash_registers;

CREATE POLICY "Users can view their own cash registers" ON cash_registers FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own cash registers" ON cash_registers FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own cash registers" ON cash_registers FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own cash registers" ON cash_registers FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela suppliers
DROP POLICY IF EXISTS "Users can view their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can create their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can update their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can delete their own suppliers" ON suppliers;

CREATE POLICY "Users can view their own suppliers" ON suppliers FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own suppliers" ON suppliers FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own suppliers" ON suppliers FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own suppliers" ON suppliers FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela business_settings (membros podem VER mas não editar)
DROP POLICY IF EXISTS "Users can view their own business settings" ON business_settings;
DROP POLICY IF EXISTS "Users can create their own business settings" ON business_settings;
DROP POLICY IF EXISTS "Users can update their own business settings" ON business_settings;
DROP POLICY IF EXISTS "Users can delete their own business settings" ON business_settings;

CREATE POLICY "Users can view their own business settings" ON business_settings FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own business settings" ON business_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business settings" ON business_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business settings" ON business_settings FOR DELETE
USING (auth.uid() = user_id);

-- Atualizar políticas da tabela sterilized_materials
DROP POLICY IF EXISTS "Users can view their own sterilized materials" ON sterilized_materials;
DROP POLICY IF EXISTS "Users can create their own sterilized materials" ON sterilized_materials;
DROP POLICY IF EXISTS "Users can update their own sterilized materials" ON sterilized_materials;
DROP POLICY IF EXISTS "Users can delete their own sterilized materials" ON sterilized_materials;

CREATE POLICY "Users can view their own sterilized materials" ON sterilized_materials FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own sterilized materials" ON sterilized_materials FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own sterilized materials" ON sterilized_materials FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own sterilized materials" ON sterilized_materials FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela procedure_materials
DROP POLICY IF EXISTS "Users can view their own procedure materials" ON procedure_materials;
DROP POLICY IF EXISTS "Users can create their own procedure materials" ON procedure_materials;
DROP POLICY IF EXISTS "Users can update their own procedure materials" ON procedure_materials;
DROP POLICY IF EXISTS "Users can delete their own procedure materials" ON procedure_materials;

CREATE POLICY "Users can view their own procedure materials" ON procedure_materials FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own procedure materials" ON procedure_materials FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own procedure materials" ON procedure_materials FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own procedure materials" ON procedure_materials FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela aftercare_templates
DROP POLICY IF EXISTS "Users can view their own aftercare templates" ON aftercare_templates;
DROP POLICY IF EXISTS "Users can create their own aftercare templates" ON aftercare_templates;
DROP POLICY IF EXISTS "Users can update their own aftercare templates" ON aftercare_templates;
DROP POLICY IF EXISTS "Users can delete their own aftercare templates" ON aftercare_templates;

CREATE POLICY "Users can view their own aftercare templates" ON aftercare_templates FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own aftercare templates" ON aftercare_templates FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own aftercare templates" ON aftercare_templates FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own aftercare templates" ON aftercare_templates FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela aftercare_schedules
DROP POLICY IF EXISTS "Users can view their own aftercare schedules" ON aftercare_schedules;
DROP POLICY IF EXISTS "Users can create their own aftercare schedules" ON aftercare_schedules;
DROP POLICY IF EXISTS "Users can update their own aftercare schedules" ON aftercare_schedules;
DROP POLICY IF EXISTS "Users can delete their own aftercare schedules" ON aftercare_schedules;

CREATE POLICY "Users can view their own aftercare schedules" ON aftercare_schedules FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own aftercare schedules" ON aftercare_schedules FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own aftercare schedules" ON aftercare_schedules FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own aftercare schedules" ON aftercare_schedules FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela loyalty_plans
DROP POLICY IF EXISTS "User can manage their own loyalty plans" ON loyalty_plans;

CREATE POLICY "Users can view their own loyalty plans" ON loyalty_plans FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own loyalty plans" ON loyalty_plans FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own loyalty plans" ON loyalty_plans FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own loyalty plans" ON loyalty_plans FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela catalogs
DROP POLICY IF EXISTS "Users can view their own catalogs" ON catalogs;
DROP POLICY IF EXISTS "Users can create their own catalogs" ON catalogs;
DROP POLICY IF EXISTS "Users can update their own catalogs" ON catalogs;
DROP POLICY IF EXISTS "Users can delete their own catalogs" ON catalogs;

CREATE POLICY "Users can view their own catalogs" ON catalogs FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own catalogs" ON catalogs FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own catalogs" ON catalogs FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own catalogs" ON catalogs FOR DELETE
USING (public.can_access_owner_data(user_id));

-- Atualizar políticas da tabela inventory_custom_fields
DROP POLICY IF EXISTS "User can manage their own inventory custom fields" ON inventory_custom_fields;

CREATE POLICY "Users can view their own inventory custom fields" ON inventory_custom_fields FOR SELECT
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can create their own inventory custom fields" ON inventory_custom_fields FOR INSERT
WITH CHECK (user_id = public.get_effective_user_id(auth.uid()));

CREATE POLICY "Users can update their own inventory custom fields" ON inventory_custom_fields FOR UPDATE
USING (public.can_access_owner_data(user_id));

CREATE POLICY "Users can delete their own inventory custom fields" ON inventory_custom_fields FOR DELETE
USING (public.can_access_owner_data(user_id));