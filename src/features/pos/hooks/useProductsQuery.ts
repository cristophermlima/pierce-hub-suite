
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InventoryProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_id: string;
  is_service: boolean;
  brand?: string;
  category?: { name: string; type: string };
}

export function useProductsQuery() {
  return useQuery({
    queryKey: ['inventory-products'],
    queryFn: async (): Promise<InventoryProduct[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          id,
          name,
          price,
          stock,
          category_id,
          is_service,
          brand,
          product_categories (
            name,
            type
          )
        `)
        .or('stock.gt.0,is_service.eq.true'); // Produtos em estoque OU serviços

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        category_id: item.category_id || '',
        is_service: item.is_service || false,
        brand: item.brand || undefined,
        category: item.product_categories ? {
          name: item.product_categories.name,
          type: item.product_categories.type || 'general'
        } : undefined
      }));
    },
  });
}
