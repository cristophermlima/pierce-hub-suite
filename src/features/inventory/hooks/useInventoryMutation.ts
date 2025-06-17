
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InventoryMutationData, InventoryItem } from '../types';

interface UseInventoryMutationProps {
  selectedItem: InventoryItem | null;
  onSuccess: () => void;
}

export function useInventoryMutation({ selectedItem, onSuccess }: UseInventoryMutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InventoryMutationData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Limpar valores undefined/null para campos opcionais
      const cleanedItem = {
        name: item.name,
        category_id: item.category_id || null,
        price: Number(item.price) || 0,
        cost_price: Number(item.cost_price) || 0,
        stock: Number(item.stock) || 0,
        threshold: Number(item.threshold) || 5,
        is_service: Boolean(item.is_service),
        sku: item.sku || null,
        brand: item.brand || null,
        supplier_id: item.supplier_id || null,
        jewelry_material_id: item.jewelry_material_id || null,
        thread_type_id: item.thread_type_id || null,
        thread_specification_id: item.thread_specification_id || null,
        ring_closure_id: item.ring_closure_id || null,
        size_mm: item.size_mm ? Number(item.size_mm) : null,
        thickness_mm: item.thickness_mm ? Number(item.thickness_mm) : null,
        length_mm: item.length_mm ? Number(item.length_mm) : null,
        diameter_mm: item.diameter_mm ? Number(item.diameter_mm) : null,
        images: item.images || []
      };

      let result;
      
      if (selectedItem) {
        // Edit existing item
        const { data, error } = await supabase
          .from('inventory')
          .update(cleanedItem)
          .eq('id', selectedItem.id)
          .eq('user_id', user.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Add new item
        const insertData = {
          ...cleanedItem,
          user_id: user.id
        };
        
        const { data, error } = await supabase
          .from('inventory')
          .insert(insertData)
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      toast.success(selectedItem ? 'Item atualizado com sucesso' : 'Item adicionado com sucesso');
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Erro na operação:', error);
      toast.error(`Falha ao ${selectedItem ? 'atualizar' : 'adicionar'} item: ${error.message}`);
    }
  });
}
