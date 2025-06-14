
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface CustomField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  options: any;
  required: boolean;
}

export function useCustomFields() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: fields = [], isLoading } = useQuery({
    queryKey: ["inventory-custom-fields"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('inventory_custom_fields')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        toast({ title: "Erro ao buscar campos customizados", description: error.message, variant: "destructive" });
        return [];
      }
      return data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (field: Partial<CustomField>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      const { error } = await supabase
        .from('inventory_custom_fields')
        .insert([{ ...field, user_id: user.id }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-custom-fields"] });
      toast({ title: "Campo criado", description: "Campo adicionado ao estoque." });
    }
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, field }: { id: string, field: Partial<CustomField> }) => {
      const { error } = await supabase
        .from('inventory_custom_fields')
        .update(field)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-custom-fields"] });
      toast({ title: "Campo atualizado" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory_custom_fields')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-custom-fields"] });
      toast({ title: "Campo removido" });
    }
  });

  return {
    fields,
    isLoading,
    createField: createMutation.mutate,
    editField: editMutation.mutate,
    deleteField: deleteMutation.mutate,
    creating: createMutation.isPending,
    editing: editMutation.isPending,
  };
}
