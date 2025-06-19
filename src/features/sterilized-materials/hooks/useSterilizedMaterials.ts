
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SterilizedMaterial, SterilizedMaterialFormData } from '../types';

export function useSterilizedMaterials() {
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['sterilized-materials'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('sterilized_materials')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;

      // Calcular se está expirado
      return data.map(material => ({
        ...material,
        is_expired: new Date(material.expiration_date) < new Date()
      })) as SterilizedMaterial[];
    }
  });

  const createMaterial = useMutation({
    mutationFn: async (materialData: SterilizedMaterialFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('sterilized_materials')
        .insert({
          ...materialData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sterilized-materials'] });
      toast.success('Material esterilizado adicionado com sucesso');
    },
    onError: (error: any) => {
      toast.error(`Erro ao adicionar material: ${error.message}`);
    }
  });

  const updateMaterial = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SterilizedMaterialFormData> }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: result, error } = await supabase
        .from('sterilized_materials')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sterilized-materials'] });
      toast.success('Material atualizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar material: ${error.message}`);
    }
  });

  const useMaterial = useMutation({
    mutationFn: async ({ id, quantityUsed }: { id: string; quantityUsed: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Primeiro, buscar o material atual
      const { data: material, error: fetchError } = await supabase
        .from('sterilized_materials')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (material.quantity_sterile < quantityUsed) {
        throw new Error('Quantidade insuficiente de material esterilizado');
      }

      // Atualizar a quantidade
      const { error: updateError } = await supabase
        .from('sterilized_materials')
        .update({
          quantity_sterile: material.quantity_sterile - quantityUsed
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Registrar o uso
      const { error: usageError } = await supabase
        .from('material_usage')
        .insert({
          material_id: id,
          quantity_used: quantityUsed,
          used_date: new Date().toISOString()
        });

      if (usageError) throw usageError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sterilized-materials'] });
      toast.success('Uso de material registrado com sucesso');
    },
    onError: (error: any) => {
      toast.error(`Erro ao registrar uso: ${error.message}`);
    }
  });

  const deleteMaterial = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('sterilized_materials')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sterilized-materials'] });
      toast.success('Material excluído com sucesso');
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir material: ${error.message}`);
    }
  });

  return {
    materials,
    isLoading,
    createMaterial: createMaterial.mutate,
    updateMaterial: updateMaterial.mutate,
    useMaterial: useMaterial.mutate,
    deleteMaterial: deleteMaterial.mutate,
    isCreating: createMaterial.isPending,
    isUpdating: updateMaterial.isPending,
    isUsing: useMaterial.isPending,
    isDeleting: deleteMaterial.isPending
  };
}
