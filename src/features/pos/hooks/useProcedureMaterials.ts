
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface ProcedureMaterial {
  id: string;
  name: string;
  unit_type: 'unit' | 'ml' | 'gr' | 'cm';
  total_quantity: number;
  unit_cost: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProcedureCost {
  id: string;
  sale_id: string;
  material_id: string;
  quantity_used: number;
  cost_per_unit: number;
  total_cost: number;
  created_at: string;
}

export function useProcedureMaterials() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['procedure-materials'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('procedure_materials')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar materiais:', error);
        toast({ title: "Erro ao buscar materiais", description: error.message, variant: "destructive" });
        return [];
      }
      
      return data || [];
    }
  });

  const createMaterial = useMutation({
    mutationFn: async (material: Omit<ProcedureMaterial, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('procedure_materials')
        .insert({
          ...material,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-materials'] });
      toast({ title: "Material criado", description: "Material adicionado com sucesso!" });
    },
    onError: (error) => {
      toast({ title: "Erro ao criar material", description: error.message, variant: "destructive" });
    }
  });

  const updateMaterial = useMutation({
    mutationFn: async ({ id, material }: { id: string, material: Partial<ProcedureMaterial> }) => {
      const { error } = await supabase
        .from('procedure_materials')
        .update(material)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-materials'] });
      toast({ title: "Material atualizado", description: "Material editado com sucesso!" });
    },
    onError: (error) => {
      toast({ title: "Erro ao atualizar material", description: error.message, variant: "destructive" });
    }
  });

  const deleteMaterial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('procedure_materials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-materials'] });
      toast({ title: "Material removido", description: "Material deletado com sucesso!" });
    },
    onError: (error) => {
      toast({ title: "Erro ao deletar material", description: error.message, variant: "destructive" });
    }
  });

  const saveProcedureCosts = async (saleId: string, costs: Array<{
    material_id: string;
    quantity_used: number;
    cost_per_unit: number;
    total_cost: number;
  }>) => {
    const { error } = await supabase
      .from('procedure_costs')
      .insert(
        costs.map(cost => ({
          sale_id: saleId,
          ...cost
        }))
      );
    
    if (error) throw error;
  };

  return {
    materials,
    isLoading,
    createMaterial: createMaterial.mutate,
    updateMaterial: updateMaterial.mutate,
    deleteMaterial: deleteMaterial.mutate,
    saveProcedureCosts,
    isCreating: createMaterial.isPending,
    isUpdating: updateMaterial.isPending,
    isDeleting: deleteMaterial.isPending
  };
}
