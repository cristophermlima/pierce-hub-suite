
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '../types';
import { toast } from 'sonner';

export function useStockUpdates(inventoryProducts: any[]) {
  const queryClient = useQueryClient();

  const updateStockMutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      for (const item of items) {
        const originalProduct = inventoryProducts.find(p => p.id === item.originalId);
        if (originalProduct && !originalProduct.is_service) {
          const { error } = await supabase
            .from('inventory')
            .update({ stock: originalProduct.stock - item.quantity })
            .eq('id', item.originalId)
            .eq('user_id', user.id);

          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      toast.success('Estoque atualizado com sucesso');
    }
  });

  return {
    updateProductStock: updateStockMutation.mutate
  };
}
