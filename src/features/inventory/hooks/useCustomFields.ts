import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getEffectiveUserId } from "@/lib/effectiveUser";

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
      
      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('inventory_custom_fields')
        .select('*');
      if (error) {
        toast({ title: "Erro ao buscar campos customizados", description: error.message, variant: "destructive" });
        return [];
      }
      return data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (field: Partial<CustomField>) => {
      const effectiveUserId = await getEffectiveUserId();
      
      const { error } = await supabase
        .from('inventory_custom_fields')
        .insert({ 
          field_name: field.field_name!,
          field_label: field.field_label!,
          field_type: field.field_type || 'text',
          options: field.options,
          required: field.required || false,
          user_id: effectiveUserId 
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-custom-fields"] });
      toast({ title: "Campo criado", description: "Campo adicionado ao estoque." });
    }
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, field }: { id: string, field: Partial<CustomField> }) => {
      // RLS gerencia acesso
      const { error } = await supabase
        .from('inventory_custom_fields')
        .update({
          field_name: field.field_name,
          field_label: field.field_label,
          field_type: field.field_type,
          options: field.options,
          required: field.required
        })
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
      // RLS gerencia acesso
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
