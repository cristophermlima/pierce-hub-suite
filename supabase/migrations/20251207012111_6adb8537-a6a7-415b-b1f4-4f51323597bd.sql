-- =====================================================
-- SECURITY FIX: Remove remaining conflicting policies
-- =====================================================

-- Drop the remaining overly permissive policies (the ones with USING: true)

-- Drop overly permissive policy on appointments
DROP POLICY IF EXISTS "Enable all operations for authenticated users on appointments" ON public.appointments;

-- Drop overly permissive policy on cash_registers
DROP POLICY IF EXISTS "Enable all operations for authenticated users on cash_registers" ON public.cash_registers;

-- Drop overly permissive policy on inventory
DROP POLICY IF EXISTS "Enable all operations for authenticated users on inventory" ON public.inventory;

-- Drop overly permissive policy on sales
DROP POLICY IF EXISTS "Enable all operations for authenticated users on sales" ON public.sales;

-- Drop overly permissive policy on sale_items
DROP POLICY IF EXISTS "Enable all operations for authenticated users on sale_items" ON public.sale_items;

-- Drop overly permissive policy on suppliers
DROP POLICY IF EXISTS "Enable all operations for suppliers" ON public.suppliers;

-- Drop overly permissive policy on product_categories (the ALL one, keep the SELECT one)
DROP POLICY IF EXISTS "Enable all operations for authenticated users on product_catego" ON public.product_categories;