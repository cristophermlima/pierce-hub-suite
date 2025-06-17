
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useInventoryData() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product_categories (
            id,
            name,
            type
          ),
          jewelry_materials (
            id,
            name
          ),
          thread_types (
            id,
            name
          ),
          thread_specifications (
            id,
            name
          ),
          ring_closures (
            id,
            name
          ),
          suppliers (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        toast.error('Erro ao carregar estoque');
        throw error;
      }
      
      return data.map((item: any) => ({
        ...item,
        category_name: item.product_categories?.name || 'Sem categoria',
        jewelry_material_name: item.jewelry_materials?.name || null,
        thread_type_name: item.thread_types?.name || null,
        thread_specification_name: item.thread_specifications?.name || null,
        ring_closure_name: item.ring_closures?.name || null,
        supplier_name: item.suppliers?.name || null
      }));
    }
  });
}
